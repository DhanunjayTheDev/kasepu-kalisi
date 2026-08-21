import { Queue } from "bullmq";
import { createQueueConnection } from "../config/redis";
import { QUEUE_NAMES } from "./queue-names";

export interface WaitlistNotifyJobData {
  waitlistEntryId: string;
}

export const waitlistQueue = new Queue<WaitlistNotifyJobData>(QUEUE_NAMES.WAITLIST_NOTIFY, {
  connection: createQueueConnection(),
  defaultJobOptions: { attempts: 3, removeOnComplete: 500, removeOnFail: 500 },
});

export async function queueWaitlistNotification(waitlistEntryId: string) {
  await waitlistQueue.add("notify", { waitlistEntryId }, { jobId: `waitlist:${waitlistEntryId}` });
}
