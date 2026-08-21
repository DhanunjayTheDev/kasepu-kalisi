import { Router } from "express";
import crypto from "crypto";
import { z } from "zod";
import { Booking } from "../bookings/booking.model";
import { Payment } from "./payment.model";
import { razorpay } from "./razorpay.client";
import { requireUser, requireAdmin } from "../../middleware/auth";
import { validateBody } from "../../middleware/validate";
import { ApiError } from "../../middleware/error-handler";
import { env } from "../../config/env";

export const paymentRouter = Router();

const createOrderSchema = z.object({ bookingId: z.string() });

paymentRouter.post("/create-order", requireUser, validateBody(createOrderSchema), async (req, res) => {
  if (!razorpay) throw new ApiError(503, "Payment gateway is not configured");

  const booking = await Booking.findOne({ _id: req.body.bookingId, user: req.auth!.sub });
  if (!booking) throw new ApiError(404, "Booking not found");
  if (booking.status !== "payment_pending") throw new ApiError(409, "This booking is not awaiting payment");

  const order = await razorpay.orders.create({
    amount: Math.round(booking.total * 100),
    currency: "INR",
    receipt: booking.bookingId,
    notes: { bookingId: booking.id },
  });

  await Payment.create({
    booking: booking.id,
    razorpayOrderId: order.id,
    amount: booking.total,
    status: "created",
  });

  res.status(201).json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId: env.RAZORPAY_KEY_ID });
});

// This confirms nothing by itself — it only lets the UI show an optimistic state.
// The webhook below is the sole source of truth for marking a booking confirmed.
const verifySchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});

paymentRouter.post("/verify", requireUser, validateBody(verifySchema), async (req, res) => {
  if (!env.RAZORPAY_KEY_SECRET) throw new ApiError(503, "Payment gateway is not configured");

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body as z.infer<typeof verifySchema>;

  const expected = crypto
    .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const valid =
    expected.length === razorpay_signature.length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(razorpay_signature));

  if (!valid) throw new ApiError(400, "Payment signature verification failed");

  res.json({ verified: true, message: "Awaiting webhook confirmation" });
});

paymentRouter.get("/", requireAdmin(), async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const [payments, total] = await Promise.all([
    Payment.find()
      .populate("booking")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Payment.countDocuments(),
  ]);

  res.json({ payments, pagination: { page, limit, total } });
});
