import { Schema, model } from "mongoose";

const artistSchema = new Schema(
  {
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true, index: true },
    name: { type: String, required: true },
    photoUrl: { type: String },
    videoUrl: { type: String },
    bio: { type: String },
    genre: { type: String },
    performanceTime: { type: String },
    socialLinks: [{ type: String }],
    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "confirmed" },
  },
  { timestamps: true }
);

export const Artist = model("Artist", artistSchema);
