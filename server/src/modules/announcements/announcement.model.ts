import { Schema, model } from "mongoose";

const announcementSchema = new Schema(
  {
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true, index: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    priority: { type: String, enum: ["low", "normal", "high"], default: "normal" },
    startTime: { type: Date },
    endTime: { type: Date },
    status: { type: String, enum: ["scheduled", "active", "expired"], default: "active" },
    createdBy: { type: Schema.Types.ObjectId, ref: "Staff" },
  },
  { timestamps: true }
);

export const Announcement = model("Announcement", announcementSchema);
