import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type {
  ArtistItem,
  AttendeeInput,
  BookingItem,
  EventItem,
  FaqItemApi,
  TestimonialItem,
  GalleryItemApi,
  MenuItemApi,
  ScheduleItemApi,
  TicketItem,
  TicketTypeItem,
} from "@/types/api";

// Events
export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: () => apiFetch<{ events: EventItem[] }>("/api/events", { skipAuth: true }).then((r) => r.events),
  });
}

export function useEvent(slug: string | undefined) {
  return useQuery({
    queryKey: ["event", slug],
    queryFn: () => apiFetch<{ event: EventItem }>(`/api/events/${slug}`, { skipAuth: true }).then((r) => r.event),
    enabled: Boolean(slug),
  });
}

// Ticket types
export function useTicketTypes(eventId: string | undefined) {
  return useQuery({
    queryKey: ["ticket-types", eventId],
    queryFn: () =>
      apiFetch<{ ticketTypes: TicketTypeItem[] }>(`/api/ticket-types?event=${eventId}`, { skipAuth: true }).then(
        (r) => r.ticketTypes
      ),
    enabled: Boolean(eventId),
  });
}

// Schedules / artists / menu / gallery — all event-scoped, public
export function useSchedules(eventId: string | undefined) {
  return useQuery({
    queryKey: ["schedules", eventId],
    queryFn: () =>
      apiFetch<{ items: ScheduleItemApi[] }>(`/api/schedules?event=${eventId}`, { skipAuth: true }).then(
        (r) => r.items
      ),
    enabled: Boolean(eventId),
  });
}

export function useArtists(eventId: string | undefined) {
  return useQuery({
    queryKey: ["artists", eventId],
    queryFn: () =>
      apiFetch<{ items: ArtistItem[] }>(`/api/artists?event=${eventId}`, { skipAuth: true }).then((r) => r.items),
    enabled: Boolean(eventId),
  });
}

export function useMenuItems(eventId: string | undefined) {
  return useQuery({
    queryKey: ["menu-items", eventId],
    queryFn: () =>
      apiFetch<{ items: MenuItemApi[] }>(`/api/menu-items?event=${eventId}`, { skipAuth: true }).then(
        (r) => r.items
      ),
    enabled: Boolean(eventId),
  });
}

export function useGallery() {
  return useQuery({
    queryKey: ["gallery"],
    queryFn: () => apiFetch<{ items: GalleryItemApi[] }>("/api/gallery", { skipAuth: true }).then((r) => r.items),
  });
}

// FAQ
export function useFaqItems() {
  return useQuery({
    queryKey: ["faq"],
    queryFn: () => apiFetch<{ items: FaqItemApi[] }>("/api/faq", { skipAuth: true }).then((r) => r.items),
  });
}

// Testimonials
export function useTestimonials() {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: () =>
      apiFetch<{ items: TestimonialItem[] }>("/api/testimonials", { skipAuth: true }).then((r) => r.items),
  });
}

// CMS content
export function useCmsContent<T = Record<string, unknown>>(key: string) {
  return useQuery({
    queryKey: ["cms", key],
    queryFn: () => apiFetch<{ content: { data: T } }>(`/api/cms/${key}`, { skipAuth: true }).then((r) => r.content.data),
  });
}

// Bookings
interface CreateBookingInput {
  eventId: string;
  ticketTypeId: string;
  quantity: number;
  contact: { fullName: string; mobile: string; email: string; gender?: string; age?: number; city?: string };
  attendees: AttendeeInput[];
  dietaryPreference?: string;
  specialRequirements?: string;
  photoConsent?: boolean;
  couponCode?: string;
}

export function useCreateBooking() {
  return useMutation({
    mutationFn: (input: CreateBookingInput) =>
      apiFetch<{ booking: BookingItem; reservation: { id: string; expiresAt: string } }>("/api/bookings", {
        method: "POST",
        body: input,
      }),
  });
}

export function useMyBookings() {
  return useQuery({
    queryKey: ["bookings", "mine"],
    queryFn: () => apiFetch<{ bookings: BookingItem[] }>("/api/bookings/mine").then((r) => r.bookings),
  });
}

export function useBooking(id: string | undefined) {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: () => apiFetch<{ booking: BookingItem }>(`/api/bookings/${id}`).then((r) => r.booking),
    enabled: Boolean(id),
  });
}

export function useBookingTickets(bookingId: string | undefined) {
  return useQuery({
    queryKey: ["booking-tickets", bookingId],
    queryFn: () => apiFetch<{ tickets: TicketItem[] }>(`/api/bookings/${bookingId}/tickets`).then((r) => r.tickets),
    enabled: Boolean(bookingId),
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { success: "Booking cancelled. Any refund will follow the event policy." },
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      apiFetch<{ booking: BookingItem }>(`/api/bookings/${id}/cancel`, { method: "POST", body: { reason } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

// Payments
export function useCreatePaymentOrder() {
  return useMutation({
    mutationFn: (bookingId: string) =>
      apiFetch<{ orderId: string; amount: number; currency: string; keyId?: string }>("/api/payments/create-order", {
        method: "POST",
        body: { bookingId },
      }),
  });
}

export function useVerifyPayment() {
  return useMutation({
    mutationFn: (input: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) =>
      apiFetch<{ verified: boolean }>("/api/payments/verify", { method: "POST", body: input }),
  });
}

// Tickets
export function useTicket(ticketId: string | undefined) {
  return useQuery({
    queryKey: ["ticket", ticketId],
    queryFn: () =>
      apiFetch<{ ticket: TicketItem; booking: BookingItem; attendee: AttendeeInput }>(`/api/tickets/${ticketId}`).then(
        (r) => r
      ),
    enabled: Boolean(ticketId),
  });
}

export function useTicketQr(ticketId: string | undefined) {
  return useQuery({
    queryKey: ["ticket-qr", ticketId],
    queryFn: () => apiFetch<{ qrDataUrl: string }>(`/api/qr/${ticketId}`).then((r) => r.qrDataUrl),
    enabled: Boolean(ticketId),
  });
}

// Waitlist
export function useJoinWaitlist() {
  return useMutation({
    meta: { success: "You're on the waitlist. We'll message you when a seat opens." },
    mutationFn: (input: { name: string; mobile: string; email?: string; event: string; ticketType: string; quantity?: number }) =>
      apiFetch("/api/waitlist", { method: "POST", body: input, skipAuth: true }),
  });
}

// Support
export function useCreateSupportTicket() {
  return useMutation({
    meta: { success: "Message sent. We'll get back to you shortly." },
    mutationFn: (input: { name: string; email: string; subject: string; message: string }) =>
      apiFetch("/api/support", { method: "POST", body: input, skipAuth: true }),
  });
}
