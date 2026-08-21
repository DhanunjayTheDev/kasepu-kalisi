import { Schema, model } from "mongoose";
import { REFUND_STATUSES } from "../../types/enums";

const refundSchema = new Schema(
  {
    booking: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    payment: { type: Schema.Types.ObjectId, ref: "Payment" },
    amount: { type: Number, required: true },
    reason: { type: String },
    status: { type: String, enum: REFUND_STATUSES, default: "requested", index: true },
    razorpayRefundId: { type: String },
    approvedBy: { type: Schema.Types.ObjectId, ref: "Staff" },
    processedAt: { type: Date },
  },
  { timestamps: true }
);

export const Refund = model("Refund", refundSchema);
