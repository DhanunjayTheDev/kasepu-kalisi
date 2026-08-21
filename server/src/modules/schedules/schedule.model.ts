import { Schema, model } from "mongoose";

const scheduleSchema = new Schema(
  {
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true, index: true },
    time: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    order: { type: Number, default: 0 },
    enabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Schedule = model("Schedule", scheduleSchema);
