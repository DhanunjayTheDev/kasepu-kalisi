import { Router } from "express";
import { Ticket } from "../tickets/ticket.model";
import { Attendee } from "../attendees/attendee.model";
import { Booking } from "../bookings/booking.model";
import { requireUser } from "../../middleware/auth";
import { ApiError } from "../../middleware/error-handler";
import { renderQrDataUrl } from "./qr.service";

export const qrRouter = Router();

// Attendees can only fetch the QR for a ticket belonging to their own booking.
qrRouter.get("/:ticketId", requireUser, async (req, res) => {
  const ticket = await Ticket.findOne({ ticketId: req.params.ticketId });
  if (!ticket) throw new ApiError(404, "Ticket not found");

  const booking = await Booking.findById(ticket.booking);
  if (!booking || booking.user.toString() !== req.auth!.sub) {
    throw new ApiError(403, "You don't have access to this ticket");
  }

  const attendee = await Attendee.findById(ticket.attendee);
  const dataUrl = await renderQrDataUrl(ticket.qrToken);

  res.json({ ticket, attendee, qrDataUrl: dataUrl });
});
