import crypto from "crypto";
import { env } from "../config/env";

// The QR encodes only this opaque token — never attendee PII. Scanning resolves
// the token back to a ticket server-side, where status/booking/payment are re-checked.
export function generateQrToken(ticketId: string): string {
  const signature = crypto.createHmac("sha256", env.JWT_SECRET).update(ticketId).digest("hex").slice(0, 24);
  return `${ticketId}.${signature}`;
}

export function verifyQrToken(token: string): { ticketId: string } | null {
  const [ticketId, signature] = token.split(".");
  if (!ticketId || !signature) return null;

  const expected = crypto.createHmac("sha256", env.JWT_SECRET).update(ticketId).digest("hex").slice(0, 24);
  const valid =
    signature.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));

  return valid ? { ticketId } : null;
}
