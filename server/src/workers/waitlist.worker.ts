import { Worker } from "bullmq";
import { createQueueConnection } from "../config/redis";
import { QUEUE_NAMES } from "../queues/queue-names";
import type { WaitlistNotifyJobData } from "../queues/waitlist.queue";
import { Waitlist } from "../modules/waitlist/waitlist.model";
import { queueEmail } from "../queues/email.queue";
import { queueWhatsApp } from "../queues/whatsapp.queue";

export const waitlistWorker = new Worker<WaitlistNotifyJobData>(
  QUEUE_NAMES.WAITLIST_NOTIFY,
  async (job) => {
    const entry = await Waitlist.findById(job.data.waitlistEntryId).populate("event ticketType");
    if (!entry) return;

    const event = entry.event as unknown as { title: string };
    const ticketType = entry.ticketType as unknown as { name: string };

    if (entry.email) {
      await queueEmail({
        to: entry.email,
        template: "event_update",
        data: {
          idempotencyKey: `waitlist:${entry.id}`,
          title: "A seat just opened up",
          message: `${ticketType.name} tickets for ${event.title} are available again. Book now before they're gone.`,
        },
      });
    }

    await queueWhatsApp({
      to: entry.mobile,
      template: "announcement",
      data: { title: "A seat opened up", message: `${ticketType.name} for ${event.title} is available again.` },
    });
  },
  { connection: createQueueConnection() }
);

waitlistWorker.on("failed", (job, err) => {
  console.error(`Waitlist notify job ${job?.id} failed:`, err.message);
});
