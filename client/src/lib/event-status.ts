import type { EventStatus } from "@/types/event";

export function getStatusCta(status: EventStatus): { label: string; disabled: boolean } {
  switch (status) {
    case "registration_open":
      return { label: "Reserve a Seat", disabled: false };
    case "sold_out":
      return { label: "Join Waitlist", disabled: false };
    case "registration_closed":
      return { label: "Registration Closed", disabled: true };
    case "postponed":
      return { label: "Event Postponed", disabled: true };
    case "cancelled":
      return { label: "Event Cancelled", disabled: true };
    case "completed":
      return { label: "Event Completed", disabled: true };
    default:
      return { label: "Coming Soon", disabled: true };
  }
}
