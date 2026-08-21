import { Schema, model } from "mongoose";
import { EVENT_STATUSES } from "../../types/enums";

const venueSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    pincode: { type: String },
    mapUrl: { type: String },
    lat: { type: Number },
    lng: { type: Number },
    parkingAvailable: { type: Boolean, default: false },
    parkingCapacity: { type: Number, default: 0 },
    parkingFee: { type: Number, default: 0 },
    parkingInstructions: { type: String },
    directions: { type: String },
    landmarks: [{ type: String }],
    publicTransport: { type: String },
    emergencyExits: { type: String },
    contactNumber: { type: String },
  },
  { _id: false }
);

const eventSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, lowercase: true },
    tagline: { type: String },
    description: { type: String },
    city: { type: String, required: true },
    date: { type: Date, required: true },
    startTime: { type: String },
    endTime: { type: String },
    status: { type: String, enum: EVENT_STATUSES, default: "draft" },
    venue: { type: venueSchema, required: true },
    priceFrom: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    seatingEnabled: { type: Boolean, default: false },
    multiEntryEnabled: { type: Boolean, default: false },
    photographyConsentNotice: { type: String },
    cancellationPolicy: {
      deadlineDays: { type: Number, default: 3 },
      refundPercentage: { type: Number, default: 0 },
      fixedFee: { type: Number, default: 0 },
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "Staff" },
  },
  { timestamps: true }
);

export const Event = model("Event", eventSchema);
