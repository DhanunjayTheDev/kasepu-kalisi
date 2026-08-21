import { Schema, model } from "mongoose";

const settingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "platform" },
    general: {
      businessName: { type: String, default: "Kasepu Kalisi Experiences Pvt Ltd" },
      supportEmail: { type: String, default: "hello@kasepukalisi.com" },
      clientUrl: { type: String },
      adminUrl: { type: String },
    },
    tax: {
      gstin: { type: String },
      invoicePrefix: { type: String, default: "KK-INV-" },
      cgstPercent: { type: Number, default: 2.5 },
      sgstPercent: { type: Number, default: 2.5 },
      igstPercent: { type: Number, default: 5 },
    },
    reminders: {
      intervalsDays: { type: [Number], default: [7, 3, 1, 0] },
    },
  },
  { timestamps: true }
);

export const Settings = model("Settings", settingsSchema);

export async function getSettings() {
  let settings = await Settings.findOne({ key: "platform" });
  if (!settings) settings = await Settings.create({ key: "platform" });
  return settings;
}
