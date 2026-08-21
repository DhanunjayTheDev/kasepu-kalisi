export const EVENT_STATUSES = [
  "draft",
  "published",
  "registration_open",
  "sold_out",
  "registration_closed",
  "completed",
  "postponed",
  "cancelled",
] as const;
export type EventStatus = (typeof EVENT_STATUSES)[number];

export const BOOKING_STATUSES = [
  "pending",
  "payment_pending",
  "confirmed",
  "cancelled",
  "expired",
  "refund_requested",
  "partially_refunded",
  "refunded",
] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const TICKET_STATUSES = ["active", "used", "cancelled", "refunded", "expired"] as const;
export type TicketStatus = (typeof TICKET_STATUSES)[number];

export const PAYMENT_STATUSES = [
  "created",
  "pending",
  "authorized",
  "captured",
  "failed",
  "cancelled",
  "refunded",
  "partially_refunded",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const REFUND_STATUSES = ["requested", "approved", "processed", "rejected"] as const;
export type RefundStatus = (typeof REFUND_STATUSES)[number];

export const STAFF_ROLES = [
  "super_admin",
  "event_manager",
  "finance_manager",
  "registration_manager",
  "checkin_staff",
  "content_manager",
  "support_staff",
] as const;
export type StaffRole = (typeof STAFF_ROLES)[number];

export const DIETARY_PREFERENCES = ["vegetarian", "non_vegetarian", "vegan", "jain"] as const;
export type DietaryPreference = (typeof DIETARY_PREFERENCES)[number];

export const GENDERS = ["male", "female", "other"] as const;
export type Gender = (typeof GENDERS)[number];

export const COUPON_TYPES = ["percentage", "fixed"] as const;
export type CouponType = (typeof COUPON_TYPES)[number];
