import { Schema, model } from "mongoose";

const notificationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    event: { type: Schema.Types.ObjectId, ref: "Event" },
    title: { type: String, required: true },
    message: { type: String, required: true },
    channel: { type: String, enum: ["website", "email", "whatsapp", "push"], default: "website" },
    readAt: { type: Date },
  },
  { timestamps: true }
);

export const Notification = model("Notification", notificationSchema);
