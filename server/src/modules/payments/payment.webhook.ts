import { Router } from "express";
import express from "express";
import crypto from "crypto";
import { env } from "../../config/env";
import { confirmBookingPayment, markBookingPaymentFailed } from "./payment.service";

export const paymentWebhookRouter = Router();

interface RazorpayWebhookPayload {
  event: string;
  payload: {
    payment: {
      entity: {
        id: string;
        order_id: string;
        method?: string;
      };
    };
  };
}

// Mounted with express.raw() (not express.json()) — Razorpay's signature is computed
// over the exact raw request bytes, so it must never pass through a body parser first.
paymentWebhookRouter.post("/", express.raw({ type: "application/json" }), async (req, res) => {
  if (!env.RAZORPAY_WEBHOOK_SECRET) {
    return res.status(503).json({ error: { message: "Webhook secret not configured" } });
  }

  const signature = req.headers["x-razorpay-signature"];
  const rawBody = req.body as Buffer;

  const expected = crypto.createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET).update(rawBody).digest("hex");

  if (typeof signature !== "string" || signature.length !== expected.length) {
    return res.status(400).json({ error: { message: "Invalid signature" } });
  }
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return res.status(400).json({ error: { message: "Invalid signature" } });
  }

  const body = JSON.parse(rawBody.toString("utf8")) as RazorpayWebhookPayload;
  const paymentEntity = body.payload?.payment?.entity;

  if (body.event === "payment.captured" && paymentEntity) {
    await confirmBookingPayment({
      razorpayOrderId: paymentEntity.order_id,
      razorpayPaymentId: paymentEntity.id,
      method: paymentEntity.method,
    });
  } else if (body.event === "payment.failed" && paymentEntity) {
    await markBookingPaymentFailed(paymentEntity.order_id);
  }

  // Razorpay retries on anything but 2xx — always acknowledge once verified.
  res.status(200).json({ received: true });
});
