import { Schema, model } from "mongoose";

const ticketReservationSchema = new Schema(
  {
    ticketType: { type: Schema.Types.ObjectId, ref: "TicketType", required: true },
    booking: { type: Schema.Types.ObjectId, ref: "Booking" },
    quantity: { type: Number, required: true, min: 1 },
    status: { type: String, enum: ["held", "confirmed", "released", "expired"], default: "held", index: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const TicketReservation = model("TicketReservation", ticketReservationSchema);
