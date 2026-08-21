import { Link } from "react-router-dom";
import { Pencil, PlusCircle } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/button";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { Select } from "@/components/select";
import { LoadingState, ErrorState } from "@/components/query-states";
import { useAdminEvents, useDeleteEvent, useUpdateEventStatus } from "@/lib/queries";
import { statusLabel } from "@/lib/status-tone";

const STATUSES = [
  "draft",
  "published",
  "registration_open",
  "sold_out",
  "registration_closed",
  "completed",
  "postponed",
  "cancelled",
];

export default function EventsPage() {
  const { data: events, isLoading, isError } = useAdminEvents();
  const updateStatus = useUpdateEventStatus();
  const deleteEvent = useDeleteEvent();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="All Events"
        description="Every Kasepu Kalisi gathering, past and upcoming."
        action={
          <Button href="/events/new">
            <PlusCircle size={16} /> Create Event
          </Button>
        }
      />

      {isLoading && <LoadingState />}
      {isError && <ErrorState />}
      {events && (
        <DataTable
          rows={events}
          rowKey={(row) => row._id}
          columns={[
            {
              header: "Event",
              accessor: (row) => (
                <Link to={`/events/${row._id}/edit`} className="font-semibold text-teal hover:underline">
                  {row.title}
                </Link>
              ),
            },
            { header: "City", accessor: (row) => row.city },
            { header: "Date", accessor: (row) => new Date(row.date).toLocaleDateString("en-IN") },
            { header: "From", accessor: (row) => `₹${row.priceFrom.toLocaleString("en-IN")}` },
            {
              header: "Status",
              accessor: (row) => (
                <Select
                  aria-label={`Change status for ${row.title}`}
                  className="w-44"
                  value={row.status}
                  onChange={(status) => updateStatus.mutate({ id: row._id, status })}
                  disabled={updateStatus.isPending}
                  options={STATUSES.map((s) => ({ value: s, label: statusLabel(s) }))}
                />
              ),
            },
            {
              header: "",
              accessor: (row) => (
                <div className="flex justify-end gap-1">
                  <Link
                    to={`/events/${row._id}/edit`}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate transition-colors hover:bg-teal/5 hover:text-teal"
                    aria-label="Edit"
                  >
                    <Pencil size={15} />
                  </Link>
                  <ConfirmDeleteButton onConfirm={() => deleteEvent.mutate(row._id)} disabled={deleteEvent.isPending} />
                </div>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}
