import { Worker } from "bullmq";
import { createQueueConnection } from "../config/redis";
import { QUEUE_NAMES } from "../queues/queue-names";
import type { EmailJobData } from "../queues/email.queue";
import { sendEmail } from "../modules/email/email.service";
import { Ticket } from "../modules/tickets/ticket.model";
import { Attendee } from "../modules/attendees/attendee.model";
import { generateTicketPdf } from "../utils/pdf-generator";

async function buildTicketAttachments(ticketIds: string[]) {
  const tickets = await Ticket.find({ ticketId: { $in: ticketIds } }).populate("event ticketType");

  return Promise.all(
    tickets.map(async (ticket) => {
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

      return { filename: `${ticket.ticketId}.pdf`, content: pdf };
    })
  );
}

export const emailWorker = new Worker<EmailJobData>(
  QUEUE_NAMES.EMAIL,
  async (job) => {
    const ticketIds = Array.isArray(job.data.data.ticketIds) ? (job.data.data.ticketIds as string[]) : [];
    const attachments = ticketIds.length > 0 ? await buildTicketAttachments(ticketIds) : undefined;

    await sendEmail({ to: job.data.to, template: job.data.template, data: job.data.data, attachments });
  },
  { connection: createQueueConnection() }
);

emailWorker.on("failed", (job, err) => {
  console.error(`Email job ${job?.id} failed:`, err.message);
});
