import { Schema, model } from "mongoose";

const cmsContentSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    data: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export const CmsContent = model("CmsContent", cmsContentSchema);

const DEFAULTS: Record<string, Record<string, unknown>> = {
  homepage: {
    eyebrow: "Gatherings With a Pulse",
    heroHeading: "Come as you are.",
    heroDescription:
      "Kasepu Kalisi is a place for meaningful time together — dinner, live music and stories that find us around a shared table.",
    primaryCtaLabel: "Explore Gatherings",
    stats: [
      { value: "12", label: "Gatherings hosted" },
      { value: "1,800+", label: "Seats shared" },
      { value: "6", label: "Cities" },
      { value: "4.9", label: "Average guest rating" },
    ],
    steps: [
      {
        title: "Choose your gathering",
        body: "Browse upcoming evenings, read the menu and the line-up, and pick the night that fits.",
      },
      {
        title: "Reserve your seat",
        body: "Select a ticket type, add your guests, and pay securely. Seats are held while you check out.",
      },
      {
        title: "Get your digital ticket",
        body: "A QR ticket lands in your inbox and WhatsApp instantly, and lives in your account until the night.",
      },
      {
        title: "Arrive and settle in",
        body: "Scan once at the gate and you're in. Everything after that is dinner, music and good company.",
      },
    ],
    ctaHeading: "There's a seat with your name on it.",
    ctaBody:
      "Gatherings are intentionally small, and they fill quickly. Reserve now, or join the waitlist and we'll tell you the moment a seat opens.",
    ctaPrimaryLabel: "Reserve a Seat",
    ctaSecondaryLabel: "Read the FAQ",
  },
  about: {
    heading: "Not an event. An encounter.",
    beliefStatement: "We believe the best nights are the ones that don't need to be documented.",
  },
  contact: {
    supportEmail: "hello@kasepukalisi.com",
    supportPhone: "+91 98765 43210",
    instagramUrl: "https://instagram.com/kasepukalisi",
  },
};

export async function getCmsContent(key: string) {
  let content = await CmsContent.findOne({ key });
  if (!content && DEFAULTS[key]) {
    content = await CmsContent.create({ key, data: DEFAULTS[key] });
  }
  return content;
}
