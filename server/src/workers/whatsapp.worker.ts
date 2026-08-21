import { Worker } from "bullmq";
import { createQueueConnection } from "../config/redis";
import { QUEUE_NAMES } from "../queues/queue-names";
import type { WhatsAppJobData } from "../queues/whatsapp.queue";
import { sendWhatsApp } from "../modules/whatsapp/whatsapp.service";

export const whatsappWorker = new Worker<WhatsAppJobData>(
  QUEUE_NAMES.WHATSAPP,
  async (job) => {
    await sendWhatsApp({ to: job.data.to, template: job.data.template, data: job.data.data });
  },
  { connection: createQueueConnection() }
);

whatsappWorker.on("failed", (job, err) => {
  console.error(`WhatsApp job ${job?.id} failed:`, err.message);
});
