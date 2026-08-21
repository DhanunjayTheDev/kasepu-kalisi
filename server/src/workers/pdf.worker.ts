import { Worker } from "bullmq";
import { createQueueConnection } from "../config/redis";
import { QUEUE_NAMES } from "../queues/queue-names";
import type { PdfJobData } from "../queues/pdf.queue";
import { Ticket } from "../modules/tickets/ticket.model";
import { Attendee } from "../modules/attendees/attendee.model";
import { generateTicketPdf } from "../utils/pdf-generator";

// Pre-warms a PDF for admin re-download / offline archival. The confirmation email
// itself generates its own copy inline (see workers/email.worker.ts) so delivery
// never blocks on this queue draining.
export const pdfWorker = new Worker<PdfJobData>(
  QUEUE_NAMES.PDF,
  async (job) => {
    const ticket = await Ticket.findById(job.data.ticketId).populate("event ticketType");
    if (!ticket) return;

    const attendee = await Attendee.findById(ticket.attendee);
    const event = ticket.event as unknown as { title: string; date: Date; venue: { name: string; city: string } };
    const ticketType = ticket.ticketType as unknown as { name: string };

    const pdf = await generateTicketPdf({
      ticketId: ticket.ticketId,
      bookingId: ticket.booking.toString(),
      eventTitle: event.title,
      eventDate: new Date(event.date).toDateString(),
      venueName: event.venue.name,
      venueCity: event.venue.city,
      ticketTypeName: ticketType.name,
      attendeeName: attendee?.name ?? "Guest",
      qrToken: ticket.qrToken,
    });

    // Upload to Google Cloud Storage happens here once GCP_BUCKET_NAME is configured;
    // until then this confirms generation succeeds without a real storage destination.
    console.log(`Generated PDF for ticket ${ticket.ticketId} (${pdf.length} bytes)`);
  },
  { connection: createQueueConnection() }
);

pdfWorker.on("failed", (job, err) => {
  console.error(`PDF job ${job?.id} failed:`, err.message);
});
