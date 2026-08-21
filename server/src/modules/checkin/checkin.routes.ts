import { Router } from "express";
import { z } from "zod";
import { Ticket } from "../tickets/ticket.model";
import { Booking } from "../bookings/booking.model";
import { Attendee } from "../attendees/attendee.model";
import { CheckIn } from "./checkIn.model";
import { requireAdmin } from "../../middleware/auth";
import { validateBody } from "../../middleware/validate";
import { verifyQrToken } from "../../utils/qr-token";
import { qs } from "../../utils/query-string";

export const checkinRouter = Router();

const scanSchema = z
  .object({
    token: z.string().optional(),
    ticketId: z.string().optional(),
    gate: z.string().optional(),
    device: z.string().optional(),
  })
  .refine((data) => data.token || data.ticketId, "Provide either a scanned token or a ticket ID");

checkinRouter.post(
  "/scan",
  requireAdmin("super_admin", "event_manager", "checkin_staff"),
  validateBody(scanSchema),
  async (req, res) => {
    // Camera scans verify the signed token; the manual-entry fallback (staff typing
    // a Ticket ID when a QR won't scan) is only reachable by authenticated staff,
    // so it can look the ticket up directly without the signature check.
    let ticketId: string | undefined;
    if (req.body.token) {
      const decoded = verifyQrToken(req.body.token);
      if (!decoded) {
        return res.json({ result: "invalid", message: "Invalid ticket" });
      }
      ticketId = decoded.ticketId;
    } else {
      ticketId = req.body.ticketId;
    }

    const ticket = await Ticket.findOne({ ticketId });
    if (!ticket) {
      return res.json({ result: "invalid", message: "Invalid ticket" });
    }

    const booking = await Booking.findById(ticket.booking);
    if (!booking || booking.status !== "confirmed") {
      return res.json({ result: "invalid", message: "Ticket has no confirmed booking" });
    }

    if (ticket.status === "cancelled" || ticket.status === "refunded" || ticket.status === "expired") {
      return res.json({ result: "invalid", message: `Ticket is ${ticket.status}` });
    }

    if (ticket.status === "used" && !ticket.multiEntry) {
      return res.json({
        result: "duplicate",
        message: "Ticket already used",
        checkedInAt: ticket.lastCheckInAt,
      });
    }

    ticket.status = "used";
    ticket.entryCount += 1;
    ticket.lastCheckInAt = new Date();
    await ticket.save();

    await CheckIn.create({
      ticket: ticket.id,
      event: ticket.event,
      staff: req.auth!.sub,
      gate: req.body.gate,
      device: req.body.device,
      direction: "in",
    });

    const attendee = await Attendee.findById(ticket.attendee);

    res.json({ result: "approved", message: "Entry approved", ticket, attendee });
  }
);

checkinRouter.get("/history", requireAdmin("super_admin", "event_manager", "checkin_staff"), async (req, res) => {
  const eventId = qs(req.query.event);
  const filter = eventId ? { event: eventId } : {};
  const checkIns = await CheckIn.find(filter)
    .populate({ path: "ticket", populate: "attendee" })
    .populate("staff")
    .populate("event")
    .sort({ createdAt: -1 })
    .limit(500);
  res.json({ checkIns });
});

checkinRouter.get("/live/:eventId", requireAdmin("super_admin", "event_manager", "checkin_staff"), async (req, res) => {
  const [checkedIn, totalTickets] = await Promise.all([
    Ticket.countDocuments({ event: req.params.eventId, entryCount: { $gt: 0 } }),
    Ticket.countDocuments({ event: req.params.eventId }),
  ]);

  res.json({
    checkedIn,
    totalTickets,
    remaining: Math.max(totalTickets - checkedIn, 0),
    rate: totalTickets > 0 ? Math.round((checkedIn / totalTickets) * 100) : 0,
  });
});
