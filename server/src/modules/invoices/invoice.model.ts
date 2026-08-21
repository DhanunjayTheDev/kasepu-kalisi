import { Schema, model } from "mongoose";

const invoiceSchema = new Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    booking: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    businessName: { type: String },
    gstin: { type: String },
  },
  { timestamps: true }
);

export const Invoice = model("Invoice", invoiceSchema);
