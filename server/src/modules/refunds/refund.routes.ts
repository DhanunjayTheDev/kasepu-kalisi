import { Router } from "express";
import { z } from "zod";
import { Refund } from "./refund.model";
import { Booking } from "../bookings/booking.model";
import { Payment } from "../payments/payment.model";
import { razorpay } from "../payments/razorpay.client";
import { requireAdmin } from "../../middleware/auth";
import { validateBody } from "../../middleware/validate";
import { ApiError } from "../../middleware/error-handler";
import { recordAuditLog } from "../auditLogs/auditLog.model";
import { queueEmail } from "../../queues/email.queue";
import { qs } from "../../utils/query-string";

export const refundRouter = Router();

refundRouter.get("/", requireAdmin("super_admin", "finance_manager"), async (req, res) => {
  const status = qs(req.query.status);
  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  const refunds = await Refund.find(filter).populate("booking").sort({ createdAt: -1 });
  res.json({ refunds });
});

const approveSchema = z.object({ amount: z.number().min(0).optional() });

refundRouter.post(
  "/:id/approve",
  requireAdmin("super_admin", "finance_manager"),
  validateBody(approveSchema),
  async (req, res) => {
    const refund = await Refund.findById(req.params.id);
    if (!refund) throw new ApiError(404, "Refund request not found");
    if (refund.status !== "requested") throw new ApiError(409, "This refund has already been processed");

    const amount = req.body.amount ?? refund.amount;
    const payment = refund.payment ? await Payment.findById(refund.payment) : null;

    if (razorpay && payment?.razorpayPaymentId) {
      const razorpayRefund = await razorpay.payments.refund(payment.razorpayPaymentId, {
        amount: Math.round(amount * 100),
      });
      refund.razorpayRefundId = razorpayRefund.id;
    }

    refund.status = "processed";
    refund.amount = amount;
    refund.approvedBy = req.auth!.sub as never;
    refund.processedAt = new Date();
    await refund.save();

    const booking = await Booking.findById(refund.booking);
    if (booking) {
      booking.status = amount >= booking.total ? "refunded" : "partially_refunded";
      await booking.save();

      await queueEmail({
        to: booking.contact.email,
        template: "refund_confirmation",
        data: { idempotencyKey: `refund:${refund.id}`, bookingId: booking.bookingId, amount },
      });
    }

    await recordAuditLog({
      actor: req.auth!.sub,
      action: "refund.issued",
      resource: refund.id,
      metadata: { amount },
    });

    res.json({ refund });
  }
);

refundRouter.post("/:id/reject", requireAdmin("super_admin", "finance_manager"), async (req, res) => {
  const refund = await Refund.findByIdAndUpdate(req.params.id, { status: "rejected" }, { returnDocument: "after" });
  if (!refund) throw new ApiError(404, "Refund request not found");

  await recordAuditLog({ actor: req.auth!.sub, action: "refund.rejected", resource: refund.id });
  res.json({ refund });
});
