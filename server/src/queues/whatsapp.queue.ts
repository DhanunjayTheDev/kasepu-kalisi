import { Queue } from "bullmq";
import { createQueueConnection } from "../config/redis";
import { QUEUE_NAMES } from "./queue-names";

export interface WhatsAppJobData {
  to: string;
  template:
    | "booking_confirmation"
    | "ticket_delivery"
    | "event_reminder"
    | "event_day_reminder"
    | "venue_directions"
    | "announcement"
    | "cancellation";
  data: Record<string, unknown>;
}

export const whatsappQueue = new Queue<WhatsAppJobData>(QUEUE_NAMES.WHATSAPP, {
  connection: createQueueConnection(),
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: 500,
    removeOnFail: 1000,
  },
});

export async function queueWhatsApp(data: WhatsAppJobData) {
  await whatsappQueue.add(data.template, data);
}
