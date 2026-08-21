import { Queue } from "bullmq";
import { createQueueConnection } from "../config/redis";
import { QUEUE_NAMES } from "./queue-names";

export interface ReservationExpiryJobData {
  reservationId: string;
}

export const reservationExpiryQueue = new Queue<ReservationExpiryJobData>(QUEUE_NAMES.RESERVATION_EXPIRY, {
  connection: createQueueConnection(),
  defaultJobOptions: {
    attempts: 1,
    removeOnComplete: 1000,
    removeOnFail: 1000,
  },
});

export async function scheduleReservationExpiry(reservationId: string, delayMs: number) {
  await reservationExpiryQueue.add(
    "expire",
    { reservationId },
    { jobId: `expire:${reservationId}`, delay: delayMs }
  );
}

export async function cancelReservationExpiry(reservationId: string) {
  const job = await reservationExpiryQueue.getJob(`expire:${reservationId}`);
  if (job) await job.remove();
}
