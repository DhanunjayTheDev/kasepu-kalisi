import { Schema, model, type InferSchemaType } from "mongoose";
import { GENDERS } from "../../types/enums";

const userSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, unique: true, index: true },
    email: { type: String, trim: true, lowercase: true },
    gender: { type: String, enum: GENDERS },
    age: { type: Number },
    city: { type: String, trim: true },
    mobileVerifiedAt: { type: Date },
    emailVerifiedAt: { type: Date },
  },
  { timestamps: true }
);

export type UserDoc = InferSchemaType<typeof userSchema>;
export const User = model("User", userSchema);
