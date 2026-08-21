import { Schema, model } from "mongoose";
import { COUPON_TYPES } from "../../types/enums";

const couponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    type: { type: String, enum: COUPON_TYPES, required: true },
    value: { type: Number, required: true },
    minOrderAmount: { type: Number, default: 0 },
    maxDiscountAmount: { type: Number },
    event: { type: Schema.Types.ObjectId, ref: "Event" },
    ticketType: { type: Schema.Types.ObjectId, ref: "TicketType" },
    startDate: { type: Date },
    endDate: { type: Date },
    usageLimit: { type: Number },
    usageCount: { type: Number, default: 0 },
    perUserLimit: { type: Number, default: 1 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Coupon = model("Coupon", couponSchema);
