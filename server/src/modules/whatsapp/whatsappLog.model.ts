import { Schema, model } from "mongoose";

const whatsappLogSchema = new Schema(
  {
    to: { type: String, required: true },
    template: { type: String, required: true },
    status: { type: String, enum: ["sent", "failed"], required: true },
    error: { type: String },
  },
  { timestamps: true }
);

export const WhatsAppLog = model("WhatsAppLog", whatsappLogSchema);
