import { Schema, model, type InferSchemaType } from "mongoose";
import { STAFF_ROLES } from "../../types/enums";

const staffSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: STAFF_ROLES, required: true },
    status: { type: String, enum: ["active", "invited", "disabled"], default: "invited" },
  },
  { timestamps: true }
);

export type StaffDoc = InferSchemaType<typeof staffSchema>;
export const Staff = model("Staff", staffSchema);
