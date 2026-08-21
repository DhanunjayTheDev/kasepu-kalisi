import { Schema, model } from "mongoose";

const supportTicketSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    booking: { type: Schema.Types.ObjectId, ref: "Booking" },
    priority: { type: String, enum: ["low", "normal", "high"], default: "normal" },
    status: { type: String, enum: ["open", "in_progress", "resolved"], default: "open" },
  },
  { timestamps: true }
);

export const SupportTicket = model("SupportTicket", supportTicketSchema);
