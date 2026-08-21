import { Router } from "express";
import { Ticket } from "./ticket.model";
import { Booking } from "../bookings/booking.model";
import { Attendee } from "../attendees/attendee.model";
import { requireUser, requireAdmin } from "../../middleware/auth";
import { ApiError } from "../../middleware/error-handler";

export const ticketRouter = Router();

ticketRouter.get("/:ticketId", requireUser, async (req, res) => {
  const ticket = await Ticket.findOne({ ticketId: req.params.ticketId }).populate("event ticketType");
  if (!ticket) throw new ApiError(404, "Ticket not found");

  const booking = await Booking.findById(ticket.booking);
  if (!booking || booking.user.toString() !== req.auth!.sub) {
    throw new ApiError(403, "You don't have access to this ticket");
  }

  const attendee = await Attendee.findById(ticket.attendee);
  res.json({ ticket, booking, attendee });
});

ticketRouter.get("/", requireAdmin(), async (req, res) => {
  const filter: Record<string, unknown> = {};
  if (req.query.event) filter.event = req.query.event;
  if (req.query.status) filter.status = req.query.status;

  const tickets = await Ticket.find(filter).populate("attendee ticketType").sort({ createdAt: -1 }).limit(500);
  res.json({ tickets });
});
