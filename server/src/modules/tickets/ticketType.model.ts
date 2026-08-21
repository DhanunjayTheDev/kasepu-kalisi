import { Schema, model } from "mongoose";

const ticketTypeSchema = new Schema(
  {
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true, index: true },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    capacity: { type: Number, required: true, min: 0 },
    sold: { type: Number, default: 0, min: 0 },
    reserved: { type: Number, default: 0, min: 0 },
    salesStart: { type: Date },
    salesEnd: { type: Date },
    maxPerBooking: { type: Number, default: 6 },
    benefits: [{ type: String }],
    dinnerIncluded: { type: Boolean, default: false },
    seatingCategory: { type: String },
    parkingIncluded: { type: Boolean, default: false },
    vipAccess: { type: Boolean, default: false },
    status: { type: String, enum: ["draft", "on_sale", "paused", "sold_out"], default: "draft" },
  },
  { timestamps: true }
);

ticketTypeSchema.virtual("available").get(function (this: { capacity: number; sold: number; reserved: number }) {
  return Math.max(this.capacity - this.sold - this.reserved, 0);
});

ticketTypeSchema.set("toJSON", { virtuals: true });

export const TicketType = model("TicketType", ticketTypeSchema);
