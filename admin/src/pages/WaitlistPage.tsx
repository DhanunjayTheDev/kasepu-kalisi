import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/button";
import { LoadingState, ErrorState } from "@/components/query-states";
import { useNotifyWaitlist, useWaitlist } from "@/lib/queries";

export default function WaitlistPage() {
  const { data: entries, isLoading, isError } = useWaitlist();
  const notify = useNotifyWaitlist();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Waitlist" description="Guests waiting for a seat to open up on sold-out ticket types." />

      {isLoading && <LoadingState />}
      {isError && <ErrorState />}
      {entries && (
        <DataTable
          rows={entries}
          rowKey={(row) => row._id}
          columns={[
            { header: "Name", accessor: (row) => row.name },
            { header: "Mobile", accessor: (row) => row.mobile },
            { header: "Event", accessor: (row) => (typeof row.event === "string" ? row.event : row.event.title) },
            {
              header: "Ticket Type",
              accessor: (row) => (typeof row.ticketType === "string" ? row.ticketType : row.ticketType.name),
            },
            { header: "Requested", accessor: (row) => new Date(row.createdAt).toLocaleDateString("en-IN") },
            {
              header: "",
              accessor: (row) =>
                row.notifiedAt ? (
                  <span className="text-xs text-slate">Notified</span>
                ) : (
                  <Button
                    variant="outline"
                    className="text-xs"
                    disabled={notify.isPending}
                    onClick={() => notify.mutate(row._id)}
                  >
                    Notify
                  </Button>
                ),
            },
          ]}
        />
      )}
    </div>
  );
}
