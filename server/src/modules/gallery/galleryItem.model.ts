import { Schema, model } from "mongoose";

const galleryItemSchema = new Schema(
  {
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true, index: true },
    album: { type: String, required: true },
    type: { type: String, enum: ["image", "video"], default: "image" },
    url: { type: String, required: true },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ["draft", "published"], default: "published" },
  },
  { timestamps: true }
);

export const GalleryItem = model("GalleryItem", galleryItemSchema);
