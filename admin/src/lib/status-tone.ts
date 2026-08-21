type Tone = "teal" | "terracotta" | "gold" | "slate";

const TONE_MAP: Record<string, Tone> = {
  registration_open: "teal",
  on_sale: "teal",
  active: "teal",
  confirmed: "teal",
  captured: "teal",
  processed: "teal",
  published: "teal",
  resolved: "teal",
  sold_out: "terracotta",
  cancelled: "terracotta",
  refunded: "terracotta",
  expired: "terracotta",
  open: "terracotta",
  high: "terracotta",
  pending: "gold",
  scheduled: "gold",
  invited: "gold",
  draft: "slate",
  completed: "slate",
  low: "slate",
  normal: "slate",
};

export function statusTone(status: string): Tone {
  return TONE_MAP[status] ?? "slate";
}

export function statusLabel(status: string): string {
  return status.replace(/_/g, " ");
}
