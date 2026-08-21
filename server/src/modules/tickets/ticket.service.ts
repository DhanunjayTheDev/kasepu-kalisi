import { Ticket } from "./ticket.model";
import { Attendee } from "../attendees/attendee.model";
import { Booking } from "../bookings/booking.model";
import { generateTicketId } from "../../utils/ids";
import { generateQrToken } from "../../utils/qr-token";
import { queuePdfGeneration } from "../../queues/pdf.queue";
import { queueEmail } from "../../queues/email.queue";

// Called once per confirmed booking — never regenerated, so this must only run once
// per booking (guarded by the webhook's idempotency check before calling this).
export async function generateTicketsForBooking(bookingId: string) {
  const booking = await Booking.findById(bookingId).populate("event ticketType");
  if (!booking) throw new Error(`Booking ${bookingId} not found`);

  const attendees = await Attendee.find({ booking: bookingId });

  const tickets = await Promise.all(
    attendees.map((attendee) => {
      const ticketId = generateTicketId();
      return Ticket.create({
        ticketId,
        booking: booking.id,
        event: booking.event,
        ticketType: booking.ticketType,
        attendee: attendee.id,
        qrToken: generateQrToken(ticketId),
        multiEntry: false,
      });
    })
  );

  for (const ticket of tickets) {
    await queuePdfGeneration({ ticketId: ticket.id });
  }

  await queueEmail({
    to: booking.contact.email,
    template: "booking_confirmation",
    data: {
      idempotencyKey: `booking-confirmation:${booking.id}`,
      bookingId: booking.bookingId,
      ticketIds: tickets.map((t) => t.ticketId),
    },
  });

  return tickets;
}
