import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { LoadingState, ErrorState } from "@/components/query-states";
import { useAdminRefunds, useApproveRefund } from "@/lib/queries";
import { statusTone, statusLabel } from "@/lib/status-tone";
import type { BookingItem } from "@/types/api";

export default function RefundsPage() {
  const { data: refunds, isLoading, isError } = useAdminRefunds();
  const approveRefund = useApproveRefund();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Refunds" description="Refund requests and their processing status." />

      {isLoading && <LoadingState />}
      {isError && <ErrorState />}
      {refunds && (
        <DataTable
          rows={refunds}
          rowKey={(row) => row._id}
          columns={[
            {
              header: "Booking",
              accessor: (row) => <span className="font-mono text-xs">{(row.booking as BookingItem).bookingId}</span>,
            },
            { header: "Amount", accessor: (row) => `₹${row.amount.toLocaleString("en-IN")}` },
            { header: "Reason", accessor: (row) => row.reason ?? "—" },
            { header: "Status", accessor: (row) => <Badge tone={statusTone(row.status)}>{statusLabel(row.status)}</Badge> },
            {
              header: "",
              accessor: (row) =>
                row.status === "requested" ? (
                  <Button
                    variant="danger"
                    className="text-xs"
                    disabled={approveRefund.isPending}
                    onClick={() => approveRefund.mutate(row._id)}
                  >
                    Approve Refund
                  </Button>
                ) : null,
            },
          ]}
        />
      )}
    </div>
  );
}
