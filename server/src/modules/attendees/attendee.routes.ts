import { Router } from "express";
import { z } from "zod";
import { Attendee } from "./attendee.model";
import { Ticket } from "../tickets/ticket.model";
import { Booking } from "../bookings/booking.model";
import { requireUser, requireAdmin } from "../../middleware/auth";
import { validateBody } from "../../middleware/validate";
import { ApiError } from "../../middleware/error-handler";
import { GENDERS } from "../../types/enums";
import { qs } from "../../utils/query-string";

export const attendeeRouter = Router();

attendeeRouter.get("/", requireAdmin(), async (req, res) => {
  const filter: Record<string, unknown> = {};
  const eventId = qs(req.query.event);
  if (eventId) {
    const bookingIds = await Booking.find({ event: eventId }).distinct("_id");
    filter.booking = { $in: bookingIds };
  }
  const attendees = await Attendee.find(filter)
    .populate({ path: "booking", populate: "event ticketType" })
    .sort({ createdAt: -1 });
  res.json({ attendees });
});

const transferSchema = z.object({
  name: z.string().min(2),
  age: z.number().min(1).max(120),
  gender: z.enum(GENDERS),
});

// Ticket transfer: swap the attendee on a ticket while keeping the booking/payment
// history intact, and record who it came from for the audit trail.
attendeeRouter.post("/tickets/:ticketId/transfer", requireUser, validateBody(transferSchema), async (req, res) => {
  const ticket = await Ticket.findOne({ ticketId: req.params.ticketId });
  if (!ticket) throw new ApiError(404, "Ticket not found");

  const booking = await Booking.findById(ticket.booking);
  if (!booking || booking.user.toString() !== req.auth!.sub) {
    throw new ApiError(403, "You don't own this ticket");
  }
  if (ticket.status !== "active") {
    throw new ApiError(409, "Only active tickets can be transferred");
  }

  const previousAttendeeId = ticket.attendee;
  const newAttendee = await Attendee.create({ booking: booking.id, ...req.body });

  ticket.attendee = newAttendee._id;
  ticket.transferredFrom = previousAttendeeId;
  await ticket.save();

  res.json({ ticket, attendee: newAttendee });
});
