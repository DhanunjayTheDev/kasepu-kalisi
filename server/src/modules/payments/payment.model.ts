import { Schema, model } from "mongoose";
import { PAYMENT_STATUSES } from "../../types/enums";

const paymentSchema = new Schema(
  {
    booking: { type: Schema.Types.ObjectId, ref: "Booking", required: true, index: true },
    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: { type: String, enum: PAYMENT_STATUSES, default: "created", index: true },
    method: { type: String },
    webhookProcessedAt: { type: Date },
  },
  { timestamps: true }
);

export const Payment = model("Payment", paymentSchema);
