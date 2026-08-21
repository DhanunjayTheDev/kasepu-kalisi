import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { LoadingState, ErrorState } from "@/components/query-states";
import { useSupportTickets, useUpdateSupportTicket } from "@/lib/queries";
import { statusTone, statusLabel } from "@/lib/status-tone";

export default function SupportPage() {
  const { data: tickets, isLoading, isError } = useSupportTickets();
  const updateTicket = useUpdateSupportTicket();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Support" description="Attendee support requests." />

      {isLoading && <LoadingState />}
      {isError && <ErrorState />}
      {tickets && (
        <DataTable
          rows={tickets}
          rowKey={(row) => row._id}
          columns={[
            { header: "Subject", accessor: (row) => row.subject },
            { header: "Customer", accessor: (row) => `${row.name} (${row.email})` },
            { header: "Priority", accessor: (row) => <Badge tone={statusTone(row.priority)}>{statusLabel(row.priority)}</Badge> },
            { header: "Status", accessor: (row) => <Badge tone={statusTone(row.status)}>{statusLabel(row.status)}</Badge> },
            {
              header: "",
              accessor: (row) =>
                row.status !== "resolved" ? (
                  <Button
                    variant="outline"
                    className="text-xs"
                    disabled={updateTicket.isPending}
                    onClick={() => updateTicket.mutate({ id: row._id, status: "resolved" })}
                  >
                    Mark Resolved
                  </Button>
                ) : null,
            },
          ]}
        />
      )}
    </div>
  );
}
