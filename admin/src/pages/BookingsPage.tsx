import { useSearchParams } from "react-router-dom";
import { X } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/badge";
import { LoadingState, ErrorState } from "@/components/query-states";
import { useAdminBookings } from "@/lib/queries";
import { statusTone, statusLabel } from "@/lib/status-tone";

export default function BookingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("q") ?? "";
  const { data: bookings, isLoading, isError } = useAdminBookings(search || undefined);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="All Bookings" description="Every booking across all gatherings." />

      {search && (
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-2 rounded-full bg-teal/8 px-3 py-1.5 text-xs font-medium text-teal">
            Search: “{search}”
            <button
              type="button"
              onClick={() => setSearchParams({})}
              aria-label="Clear search"
              className="text-slate hover:text-terracotta"
            >
              <X size={13} />
            </button>
          </span>
        </div>
      )}

      {isLoading && <LoadingState />}
      {isError && <ErrorState />}
      {bookings && (
        <DataTable
          rows={bookings}
          rowKey={(row) => row._id}
          columns={[
            { header: "Booking ID", accessor: (row) => <span className="font-mono text-xs">{row.bookingId}</span> },
            { header: "Customer", accessor: (row) => row.contact.fullName },
            { header: "Event", accessor: (row) => (typeof row.event === "string" ? row.event : row.event.title) },
            { header: "Tickets", accessor: (row) => row.quantity },
            { header: "Amount", accessor: (row) => `₹${row.total.toLocaleString("en-IN")}` },
            { header: "Date", accessor: (row) => new Date(row.createdAt).toLocaleDateString("en-IN") },
            { header: "Status", accessor: (row) => <Badge tone={statusTone(row.status)}>{statusLabel(row.status)}</Badge> },
          ]}
        />
      )}
    </div>
  );
}
