import { Queue } from "bullmq";
import { createQueueConnection } from "../config/redis";
import { QUEUE_NAMES } from "./queue-names";

export interface EmailJobData {
  to: string;
  template:
    | "booking_confirmation"
    | "payment_failed"
    | "refund_confirmation"
    | "event_reminder"
    | "event_update"
    | "event_cancelled"
    | "event_postponed"
    | "post_event_thank_you"
    | "staff_invite";
  data: Record<string, unknown>;
}

export const emailQueue = new Queue<EmailJobData>(QUEUE_NAMES.EMAIL, {
  connection: createQueueConnection(),
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: 500,
    removeOnFail: 1000,
  },
});

export async function queueEmail(data: EmailJobData) {
  await emailQueue.add(data.template, data, {
    // Idempotent per (template, recipient, jobKey) when caller supplies one in data.
    jobId: typeof data.data.idempotencyKey === "string" ? data.data.idempotencyKey : undefined,
  });
}
