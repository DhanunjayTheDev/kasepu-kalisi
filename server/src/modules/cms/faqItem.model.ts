import { Schema, model } from "mongoose";

const faqItemSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const FaqItem = model("FaqItem", faqItemSchema);
