import { useParams } from "react-router-dom";
import { Section } from "@/components/section";
import { DigitalTicket } from "@/components/digital-ticket";
import { AuthGate } from "@/components/auth-gate";
import { LoadingState, ErrorState } from "@/components/query-states";
import { useTicket } from "@/lib/queries";
import { usePageTitle } from "@/lib/use-page-title";
import { formatDate } from "@/lib/format";
import type { EventItem, TicketTypeItem } from "@/types/api";

function TicketContent() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const { data, isLoading, isError } = useTicket(ticketId);

  if (isLoading) return <LoadingState label="Loading your ticket…" />;
  if (isError || !data) return <ErrorState message="We couldn't find that ticket." />;

  const { ticket, booking, attendee } = data;
  const event = ticket.event as EventItem;
  const ticketType = ticket.ticketType as TicketTypeItem;

  return (
    <DigitalTicket
      ticketId={ticket.ticketId}
      bookingId={booking.bookingId}
      attendeeName={attendee.name}
      ticketTypeName={ticketType.name}
      eventTitle={event.title}
      date={formatDate(event.date)}
      time={event.startTime}
      venueName={event.venue.name}
      venueCity={event.venue.city}
      qrValue={ticket.qrToken}
      status={ticket.status}
    />
  );
}

export default function TicketDetailPage() {
  usePageTitle("Your Ticket");

  return (
    <Section>
      <AuthGate>
        <TicketContent />
      </AuthGate>
    </Section>
  );
}
