import { Schema, model } from "mongoose";
import { BOOKING_STATUSES, GENDERS } from "../../types/enums";

const contactSchema = new Schema(
  {
    fullName: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    gender: { type: String, enum: GENDERS },
    age: { type: Number },
    city: { type: String },
  },
  { _id: false }
);

const bookingSchema = new Schema(
  {
    bookingId: { type: String, required: true, unique: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    ticketType: { type: Schema.Types.ObjectId, ref: "TicketType", required: true },
    reservation: { type: Schema.Types.ObjectId, ref: "TicketReservation" },
    quantity: { type: Number, required: true, min: 1 },
    contact: { type: contactSchema, required: true },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    fees: { type: Number, default: 0 },
    total: { type: Number, required: true },
    coupon: { type: Schema.Types.ObjectId, ref: "Coupon" },
    payment: { type: Schema.Types.ObjectId, ref: "Payment" },
    status: { type: String, enum: BOOKING_STATUSES, default: "pending", index: true },
    dietaryPreference: { type: String },
    specialRequirements: { type: String },
    photoConsent: { type: Boolean, default: false },
    cancelledAt: { type: Date },
    cancellationReason: { type: String },
  },
  { timestamps: true }
);

export const Booking = model("Booking", bookingSchema);
