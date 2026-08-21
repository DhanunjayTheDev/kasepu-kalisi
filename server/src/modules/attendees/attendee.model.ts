import { Schema, model } from "mongoose";
import { GENDERS } from "../../types/enums";

const attendeeSchema = new Schema(
  {
    booking: { type: Schema.Types.ObjectId, ref: "Booking", required: true, index: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: GENDERS, required: true },
  },
  { timestamps: true }
);

export const Attendee = model("Attendee", attendeeSchema);
