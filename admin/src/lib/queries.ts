import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type {
  AnnouncementItem,
  ArtistItem,
  AttendeeItem,
  AuditLogItem,
  BookingItem,
  CheckInItem,
  CouponItem,
  EventItem,
  GalleryItemApi,
  MenuItemApi,
  PaymentItem,
  RefundItem,
  ScheduleItemApi,
  SettingsData,
  StaffItem,
  SupportTicketItem,
  TicketTypeItem,
  WaitlistEntry,
} from "@/types/api";

function useList<T>(key: string, path: string, itemsKey: string) {
  return useQuery({
    queryKey: [key],
    queryFn: () => apiFetch<Record<string, T[]>>(path).then((r) => r[itemsKey]),
  });
}

// Events
export const useAdminEvents = () => useList<EventItem>("events", "/api/events", "events");
export const useEvent = (id: string | undefined) =>
  useQuery({
    queryKey: ["event", id],
    queryFn: () => apiFetch<{ event: EventItem }>(`/api/events/${id}`).then((r) => r.event),
    enabled: Boolean(id),
  });

export function useCreateEvent() {
  const qc = useQueryClient();
  return useMutation({
    meta: { success: "Event created." },
    mutationFn: (input: Record<string, unknown>) => apiFetch<{ event: EventItem }>("/api/events", { method: "POST", body: input }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  });
}

export function useUpdateEvent() {
  const qc = useQueryClient();
  return useMutation({
    meta: { success: "Event updated." },
    mutationFn: ({ id, ...body }: { id: string } & Record<string, unknown>) =>
      apiFetch<{ event: EventItem }>(`/api/events/${id}`, { method: "PATCH", body }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  });
}

export const useDeleteEvent = () => useDelete("events", "/api/events", "Event");

export function useUpdateEventStatus() {
  const qc = useQueryClient();
  return useMutation({
    meta: { success: "Event status changed." },
    mutationFn: ({ id, status, reason }: { id: string; status: string; reason?: string }) =>
      apiFetch(`/api/events/${id}/status`, { method: "PATCH", body: { status, reason } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  });
}

// Schedules / Artists / Menu / Gallery
export const useSchedules = () => useList<ScheduleItemApi>("schedules", "/api/schedules", "items");
export const useArtists = () => useList<ArtistItem>("artists", "/api/artists", "items");
export const useMenuItems = () => useList<MenuItemApi>("menu-items", "/api/menu-items", "items");
export const useGalleryItems = () => useList<GalleryItemApi>("gallery", "/api/gallery", "items");

function useCreate<T>(key: string, path: string, label: string) {
  const qc = useQueryClient();
  return useMutation({
    meta: { success: `${label} created.` },
    mutationFn: (input: object) => apiFetch<{ item: T }>(path, { method: "POST", body: input }),
    onSuccess: () => qc.invalidateQueries({ queryKey: [key] }),
  });
}

function useUpdate<T>(key: string, path: string, label: string) {
  const qc = useQueryClient();
  return useMutation({
    meta: { success: `${label} updated.` },
    mutationFn: ({ id, ...body }: { id: string } & Record<string, unknown>) =>
      apiFetch<{ item: T }>(`${path}/${id}`, { method: "PATCH", body }),
    onSuccess: () => qc.invalidateQueries({ queryKey: [key] }),
  });
}

function useDelete(key: string, path: string, label: string) {
  const qc = useQueryClient();
  return useMutation({
    meta: { success: `${label} deleted.` },
    mutationFn: (id: string) => apiFetch(`${path}/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: [key] }),
  });
}

export const useCreateSchedule = () => useCreate<ScheduleItemApi>("schedules", "/api/schedules", "Schedule item");
export const useUpdateSchedule = () => useUpdate<ScheduleItemApi>("schedules", "/api/schedules", "Schedule item");
export const useDeleteSchedule = () => useDelete("schedules", "/api/schedules", "Schedule item");

export const useCreateArtist = () => useCreate<ArtistItem>("artists", "/api/artists", "Artist");
export const useUpdateArtist = () => useUpdate<ArtistItem>("artists", "/api/artists", "Artist");
export const useDeleteArtist = () => useDelete("artists", "/api/artists", "Artist");

export const useCreateMenuItem = () => useCreate<MenuItemApi>("menu-items", "/api/menu-items", "Menu item");
export const useUpdateMenuItem = () => useUpdate<MenuItemApi>("menu-items", "/api/menu-items", "Menu item");
export const useDeleteMenuItem = () => useDelete("menu-items", "/api/menu-items", "Menu item");

export const useCreateGalleryItem = () => useCreate<GalleryItemApi>("gallery", "/api/gallery", "Media");
export const useUpdateGalleryItem = () => useUpdate<GalleryItemApi>("gallery", "/api/gallery", "Media");
export const useDeleteGalleryItem = () => useDelete("gallery", "/api/gallery", "Media");

// Ticket types / inventory
export const useTicketTypes = () => useList<TicketTypeItem>("ticket-types", "/api/ticket-types", "ticketTypes");

export function useCreateTicketType() {
  const qc = useQueryClient();
  return useMutation({
    meta: { success: "Ticket type created." },
    mutationFn: (input: Record<string, unknown>) =>
      apiFetch<{ ticketType: TicketTypeItem }>("/api/ticket-types", { method: "POST", body: input }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ticket-types"] }),
  });
}

export function useUpdateTicketType() {
  const qc = useQueryClient();
  return useMutation({
    meta: { success: "Ticket type updated." },
    mutationFn: ({ id, ...body }: { id: string } & Record<string, unknown>) =>
      apiFetch<{ ticketType: TicketTypeItem }>(`/api/ticket-types/${id}`, { method: "PATCH", body }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ticket-types"] }),
  });
}

export const useDeleteTicketType = () => useDelete("ticket-types", "/api/ticket-types", "Ticket type");

// Coupons
export const useCoupons = () => useList<CouponItem>("coupons", "/api/coupons", "coupons");
export const useCreateCoupon = () => useCreate<CouponItem>("coupons", "/api/coupons", "Coupon");
export const useUpdateCoupon = () => useUpdate<CouponItem>("coupons", "/api/coupons", "Coupon");
export const useDeleteCoupon = () => useDelete("coupons", "/api/coupons", "Coupon");

// Waitlist
export const useWaitlist = () => useList<WaitlistEntry>("waitlist", "/api/waitlist", "entries");
export function useNotifyWaitlist() {
  const qc = useQueryClient();
  return useMutation({
    meta: { success: "Waitlist guest notified." },
    mutationFn: (id: string) => apiFetch(`/api/waitlist/${id}/notify`, { method: "POST" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["waitlist"] }),
  });
}

// Bookings / Attendees / Payments / Refunds
export const useAdminBookings = (search?: string) =>
  useQuery({
    queryKey: ["bookings", search ?? ""],
    queryFn: () =>
      apiFetch<{ bookings: BookingItem[] }>(
        search ? `/api/bookings?q=${encodeURIComponent(search)}` : "/api/bookings"
      ).then((r) => r.bookings),
  });
export const useAdminAttendees = () => useList<AttendeeItem>("attendees", "/api/attendees", "attendees");
export const useAdminPayments = () => useList<PaymentItem>("payments", "/api/payments", "payments");
export const useAdminRefunds = () => useList<RefundItem>("refunds", "/api/refunds", "refunds");

export function useApproveRefund() {
  const qc = useQueryClient();
  return useMutation({
    meta: { success: "Refund approved." },
    mutationFn: (id: string) => apiFetch(`/api/refunds/${id}/approve`, { method: "POST", body: {} }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["refunds"] }),
  });
}

// Check-in
export const useCheckinHistory = () => useList<CheckInItem>("checkin-history", "/api/checkin/history", "checkIns");
export function useLiveAttendance(eventId: string | undefined) {
  return useQuery({
    queryKey: ["checkin-live", eventId],
    queryFn: () =>
      apiFetch<{ checkedIn: number; totalTickets: number; remaining: number; rate: number }>(`/api/checkin/live/${eventId}`),
    enabled: Boolean(eventId),
  });
}
export function useScanTicket() {
  return useMutation({
    mutationFn: (input: { token?: string; ticketId?: string; gate?: string; device?: string }) =>
      apiFetch<{ result: string; message: string; ticket?: unknown; attendee?: unknown; checkedInAt?: string }>(
        "/api/checkin/scan",
        { method: "POST", body: input }
      ),
  });
}

// Announcements
export const useAnnouncements = () => useList<AnnouncementItem>("announcements", "/api/announcements", "announcements");
export const useCreateAnnouncement = () => useCreate<AnnouncementItem>("announcements", "/api/announcements", "Announcement");
export const useDeleteAnnouncement = () => useDelete("announcements", "/api/announcements", "Announcement");

// Support
export const useSupportTickets = () => useList<SupportTicketItem>("support", "/api/support", "tickets");
export function useUpdateSupportTicket() {
  const qc = useQueryClient();
  return useMutation({
    meta: { success: "Support ticket updated." },
    mutationFn: ({ id, ...body }: { id: string; status?: string; priority?: string }) =>
      apiFetch(`/api/support/${id}`, { method: "PATCH", body }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["support"] }),
  });
}

// Reports
export function useSalesReport() {
  return useQuery({
    queryKey: ["reports", "sales"],
    queryFn: () =>
      apiFetch<{ byTicketType: { _id: string; tickets: number; revenue: number }[]; byDay: { _id: string; tickets: number; revenue: number }[] }>(
        "/api/reports/sales"
      ),
  });
}

export function useRevenueReport() {
  return useQuery({
    queryKey: ["reports", "revenue"],
    queryFn: () =>
      apiFetch<{ byEvent: { _id: string; event: EventItem; gross: number; discounts: number; tax: number; net: number }[]; totalRefunded: number }>(
        "/api/reports/revenue"
      ),
  });
}

export function useAttendanceReport() {
  return useQuery({
    queryKey: ["reports", "attendance"],
    queryFn: () =>
      apiFetch<{ byEvent: { _id: string; event: EventItem; sold: number; checkedIn: number }[] }>("/api/reports/attendance"),
  });
}

export function exportReportUrl(type: string) {
  return `${(import.meta.env.VITE_API_URL as string) ?? "http://localhost:4000"}/api/reports/exports/${type}`;
}

// Users / Staff
export const useAdminUsers = () =>
  useQuery({
    queryKey: ["users"],
    queryFn: () => apiFetch<{ users: { _id: string; fullName: string; mobile: string; email?: string }[] }>("/api/users").then((r) => r.users),
  });

export const useStaff = () => useList<StaffItem>("staff", "/api/staff", "staff");
export function useInviteStaff() {
  const qc = useQueryClient();
  return useMutation({
    meta: { success: "Invitation sent." },
    mutationFn: (input: { name: string; email: string; role: string }) =>
      apiFetch<{ staff: StaffItem }>("/api/staff", { method: "POST", body: input }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["staff"] }),
  });
}
export const useUpdateStaff = () => useUpdate<StaffItem>("staff", "/api/staff", "Staff member");
export const useDeleteStaff = () => useDelete("staff", "/api/staff", "Staff member");

// Audit logs
export const useAuditLogs = () => useList<AuditLogItem>("audit-logs", "/api/audit-logs", "logs");

// CMS
export function useCmsContent<T = Record<string, unknown>>(key: string) {
  return useQuery({
    queryKey: ["cms", key],
    queryFn: () => apiFetch<{ content: { data: T } }>(`/api/cms/${key}`).then((r) => r.content.data),
  });
}

export function useUpdateCmsContent(key: string) {
  const qc = useQueryClient();
  return useMutation({
    meta: { success: "Content published." },
    mutationFn: (data: object) => apiFetch(`/api/cms/${key}`, { method: "PATCH", body: { data } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cms", key] }),
  });
}

export interface FaqItemApi {
  _id: string;
  question: string;
  answer: string;
  order: number;
}
export interface TestimonialItem {
  _id: string;
  name: string;
  role?: string;
  city?: string;
  quote: string;
  rating: number;
  eventName?: string;
  status: string;
  order: number;
}

export const useTestimonials = () => useList<TestimonialItem>("testimonials", "/api/testimonials", "items");
export const useCreateTestimonial = () => useCreate<TestimonialItem>("testimonials", "/api/testimonials", "Testimonial");
export const useUpdateTestimonial = () => useUpdate<TestimonialItem>("testimonials", "/api/testimonials", "Testimonial");
export const useDeleteTestimonial = () => useDelete("testimonials", "/api/testimonials", "Testimonial");

export const useFaqItems = () => useList<FaqItemApi>("faq", "/api/faq", "items");
export const useCreateFaqItem = () => useCreate<FaqItemApi>("faq", "/api/faq", "FAQ question");
export const useUpdateFaqItem = () => useUpdate<FaqItemApi>("faq", "/api/faq", "FAQ question");
export const useDeleteFaqItem = () => useDelete("faq", "/api/faq", "FAQ question");

// Settings
export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: () => apiFetch<{ settings: SettingsData }>("/api/settings").then((r) => r.settings),
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    meta: { success: "Settings saved." },
    mutationFn: (input: Partial<SettingsData>) => apiFetch("/api/settings", { method: "PATCH", body: input }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings"] }),
  });
}
