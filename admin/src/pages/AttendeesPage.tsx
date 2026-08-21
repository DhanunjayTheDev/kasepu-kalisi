import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/data-table";
import { LoadingState, ErrorState } from "@/components/query-states";
import { useAdminAttendees } from "@/lib/queries";
import type { BookingItem, EventItem, TicketTypeItem } from "@/types/api";

export default function AttendeesPage() {
  const { data: attendees, isLoading, isError } = useAdminAttendees();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Attendees" description="Every attendee registered across bookings." />

      {isLoading && <LoadingState />}
      {isError && <ErrorState />}
      {attendees && (
        <DataTable
          rows={attendees}
          rowKey={(row) => row._id}
          columns={[
            { header: "Name", accessor: (row) => `${row.name} (${row.age}, ${row.gender})` },
            {
              header: "Contact",
              accessor: (row) => {
                const booking = row.booking as BookingItem;
                return `${booking.contact.mobile} · ${booking.contact.email}`;
              },
            },
            {
              header: "Event",
              accessor: (row) => {
                const booking = row.booking as BookingItem;
                const event = booking.event as EventItem;
                return event?.title ?? "—";
              },
            },
            {
              header: "Ticket Type",
              accessor: (row) => {
                const booking = row.booking as BookingItem;
                const ticketType = booking.ticketType as TicketTypeItem;
                return ticketType?.name ?? "—";
              },
            },
          ]}
        />
      )}
    </div>
  );
}
