import { Schema, model } from "mongoose";
import { TICKET_STATUSES } from "../../types/enums";

const ticketSchema = new Schema(
  {
    ticketId: { type: String, required: true, unique: true, index: true },
    booking: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    ticketType: { type: Schema.Types.ObjectId, ref: "TicketType", required: true },
    attendee: { type: Schema.Types.ObjectId, ref: "Attendee", required: true },
    qrToken: { type: String, required: true, unique: true },
    status: { type: String, enum: TICKET_STATUSES, default: "active", index: true },
    multiEntry: { type: Boolean, default: false },
    entryCount: { type: Number, default: 0 },
    lastCheckInAt: { type: Date },
    transferredFrom: { type: Schema.Types.ObjectId, ref: "Attendee" },
  },
  { timestamps: true }
);

export const Ticket = model("Ticket", ticketSchema);
