import { Schema, model } from "mongoose";

const testimonialSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, trim: true },
    city: { type: String, trim: true },
    quote: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    eventName: { type: String, trim: true },
    status: { type: String, enum: ["draft", "published"], default: "published" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Testimonial = model("Testimonial", testimonialSchema);
