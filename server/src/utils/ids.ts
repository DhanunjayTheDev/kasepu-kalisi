import crypto from "crypto";
import { getNextSequence } from "./counter.model";

export async function generateBookingId(): Promise<string> {
  const year = new Date().getFullYear();
  const seq = await getNextSequence(`booking:${year}`);
  return `KK-${year}-${String(seq).padStart(6, "0")}`;
}

export function generateTicketId(): string {
  return `KK-TKT-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
}

export function generateInvoiceNumber(prefix: string, seq: number): string {
  return `${prefix}${String(seq).padStart(6, "0")}`;
}
