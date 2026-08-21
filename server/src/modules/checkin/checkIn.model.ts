import { Schema, model } from "mongoose";

const checkInSchema = new Schema(
  {
    ticket: { type: Schema.Types.ObjectId, ref: "Ticket", required: true, index: true },
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    staff: { type: Schema.Types.ObjectId, ref: "Staff" },
    gate: { type: String },
    device: { type: String },
    direction: { type: String, enum: ["in", "out"], default: "in" },
  },
  { timestamps: true }
);

export const CheckIn = model("CheckIn", checkInSchema);
