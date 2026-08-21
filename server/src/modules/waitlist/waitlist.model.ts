import { Schema, model } from "mongoose";

const waitlistSchema = new Schema(
  {
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String },
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    ticketType: { type: Schema.Types.ObjectId, ref: "TicketType", required: true },
    quantity: { type: Number, default: 1 },
    notifiedAt: { type: Date },
    convertedAt: { type: Date },
  },
  { timestamps: true }
);

export const Waitlist = model("Waitlist", waitlistSchema);
