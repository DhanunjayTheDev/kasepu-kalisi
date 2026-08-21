import { Worker } from "bullmq";
import { createQueueConnection } from "../config/redis";
import { QUEUE_NAMES } from "../queues/queue-names";
import type { ReservationExpiryJobData } from "../queues/reservation-expiry.queue";
import { expireReservation } from "../modules/ticketReservations/ticketReservation.service";

// This is the safety net: Redis's own TTL on a hold is a fast, best-effort signal,
// but this delayed job is what actually releases inventory in MongoDB if a booking
// never completes payment in time.
export const reservationExpiryWorker = new Worker<ReservationExpiryJobData>(
  QUEUE_NAMES.RESERVATION_EXPIRY,
  async (job) => {
    await expireReservation(job.data.reservationId);
  },
  { connection: createQueueConnection() }
);

reservationExpiryWorker.on("failed", (job, err) => {
  console.error(`Reservation expiry job ${job?.id} failed:`, err.message);
});
