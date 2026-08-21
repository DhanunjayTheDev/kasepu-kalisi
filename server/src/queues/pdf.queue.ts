import { Queue } from "bullmq";
import { createQueueConnection } from "../config/redis";
import { QUEUE_NAMES } from "./queue-names";

export interface PdfJobData {
  ticketId: string;
}

export const pdfQueue = new Queue<PdfJobData>(QUEUE_NAMES.PDF, {
  connection: createQueueConnection(),
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 3000 },
    removeOnComplete: 500,
    removeOnFail: 1000,
  },
});

export async function queuePdfGeneration(data: PdfJobData) {
  await pdfQueue.add("generate-ticket-pdf", data, { jobId: `pdf:${data.ticketId}` });
}
