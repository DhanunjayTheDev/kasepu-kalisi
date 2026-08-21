import { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, MapPin, Ticket as TicketIcon } from "lucide-react";
import { Section } from "@/components/section";
import { AuthGate } from "@/components/auth-gate";
import { Button } from "@/components/button";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { LoadingState, ErrorState, EmptyState } from "@/components/query-states";
import { useBookingTickets, useCancelBooking, useMyBookings } from "@/lib/queries";
import { usePageTitle } from "@/lib/use-page-title";
import { formatCurrency, formatDate } from "@/lib/format";
import { imageForSlug } from "@/lib/media";
import type { BookingItem, EventItem } from "@/types/api";

const CANCELLABLE = ["confirmed", "payment_pending"];

function BookingRow({ booking }: { booking: BookingItem }) {
  const event = booking.event as EventItem;
  const { data: tickets } = useBookingTickets(booking._id);
  const cancelBooking = useCancelBooking();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const canCancel = CANCELLABLE.includes(booking.status);

  return (
    <article className="overflow-hidden rounded-2xl border border-slate/15 bg-white">
      <div className="flex flex-col sm:flex-row">
        <div className="relative h-40 shrink-0 sm:h-auto sm:w-52">
          <img src={imageForSlug(event.slug)} alt="" loading="lazy" className="h-full w-full object-cover" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="font-display text-2xl leading-tight text-teal">{event.title}</h2>
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 font-sans text-sm text-slate">
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={14} className="text-gold" />
                  {formatDate(event.date)}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-gold" />
                  {event.venue.name}, {event.city}
                </span>
                <span className="flex items-center gap-1.5">
                  <TicketIcon size={14} className="text-gold" />
                  {booking.quantity} {booking.quantity === 1 ? "seat" : "seats"} · {formatCurrency(booking.total)}
                </span>
              </div>
              <p className="mt-2 font-mono text-xs text-slate/80">{booking.bookingId}</p>
            </div>

            <span className="shrink-0 rounded-full bg-teal/10 px-3 py-1 font-sans text-xs font-semibold uppercase tracking-wide text-teal">
              {booking.status.replace(/_/g, " ")}
            </span>
          </div>

          {tickets && tickets.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-3 border-t border-slate/10 pt-5">
              {tickets.map((ticket) => (
                <Link
                  key={ticket._id}
                  to={`/tickets/${ticket.ticketId}`}
                  className="rounded-full border border-teal/30 px-4 py-2 font-sans text-xs font-semibold text-teal transition-colors hover:bg-teal hover:text-ivory"
                >
                  {ticket.ticketId}
                </Link>
              ))}
            </div>
          )}

          {canCancel && (
            <div className="mt-5 flex justify-end border-t border-slate/10 pt-5">
              <Button
                variant="ghost"
                className="min-h-0 px-4 py-2 text-terracotta hover:bg-terracotta/10"
                disabled={cancelBooking.isPending}
                onClick={() => setConfirmOpen(true)}
              >
                {cancelBooking.isPending ? "Cancelling…" : "Cancel booking"}
              </Button>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Cancel this booking?"
        body={`This releases your ${booking.quantity === 1 ? "seat" : "seats"} for ${event.title}. Any refund follows the event's cancellation policy.`}
        confirmLabel="Cancel booking"
        cancelLabel="Keep it"
        pending={cancelBooking.isPending}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          cancelBooking.mutate({ id: booking._id });
        }}
      />
    </article>
  );
}

function BookingsContent() {
  const { data: bookings, isLoading, isError } = useMyBookings();

  if (isLoading) return <LoadingState label="Loading your bookings…" />;
  if (isError) return <ErrorState message="Couldn't load your bookings." />;
  if (!bookings || bookings.length === 0) {
    return (
      <div className="mt-8">
        <EmptyState message="You haven't booked a gathering yet." />
        <div className="mt-6">
          <Button href="/events">Browse gatherings →</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-col gap-5">
      {bookings.map((booking) => (
        <BookingRow key={booking._id} booking={booking} />
      ))}
    </div>
  );
}

export default function AccountBookingsPage() {
  usePageTitle("Your Bookings");

  return (
    <Section>
      <AuthGate>
        <span className="eyebrow text-gold">Your Bookings</span>
        <h1 className="mt-2 text-4xl">Every gathering you&apos;ve joined.</h1>
        <BookingsContent />
      </AuthGate>
    </Section>
  );
}
