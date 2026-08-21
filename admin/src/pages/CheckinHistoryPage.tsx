import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/data-table";
import { LoadingState, ErrorState } from "@/components/query-states";
import { useCheckinHistory } from "@/lib/queries";
import type { EventItem } from "@/types/api";

export default function CheckinHistoryPage() {
  const { data: checkIns, isLoading, isError } = useCheckinHistory();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Check-in History" description="Full record of every scan across every gathering." />

      {isLoading && <LoadingState />}
      {isError && <ErrorState />}
      {checkIns && (
        <DataTable
          rows={checkIns}
          rowKey={(row) => row._id}
          columns={[
            {
              header: "Ticket ID",
              accessor: (row) => <span className="font-mono text-xs">{(row.ticket as { ticketId: string }).ticketId}</span>,
            },
            {
              header: "Attendee",
              accessor: (row) => (row.ticket as { attendee?: { name: string } }).attendee?.name ?? "—",
            },
            { header: "Event", accessor: (row) => (row.event as EventItem)?.title ?? "—" },
            { header: "Time", accessor: (row) => new Date(row.createdAt).toLocaleString("en-IN") },
            { header: "Gate", accessor: (row) => row.gate ?? "—" },
            { header: "Device", accessor: (row) => row.device ?? "—" },
          ]}
        />
      )}
    </div>
  );
}
