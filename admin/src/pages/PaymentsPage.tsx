import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/badge";
import { LoadingState, ErrorState } from "@/components/query-states";
import { useAdminPayments } from "@/lib/queries";
import { statusTone, statusLabel } from "@/lib/status-tone";
import type { BookingItem } from "@/types/api";

export default function PaymentsPage() {
  const { data: payments, isLoading, isError } = useAdminPayments();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Payments" description="Razorpay payment records, reconciled with bookings." />

      {isLoading && <LoadingState />}
      {isError && <ErrorState />}
      {payments && (
        <DataTable
          rows={payments}
          rowKey={(row) => row._id}
          columns={[
            { header: "Order ID", accessor: (row) => <span className="font-mono text-xs">{row.razorpayOrderId}</span> },
            {
              header: "Booking",
              accessor: (row) => <span className="font-mono text-xs">{(row.booking as BookingItem).bookingId}</span>,
            },
            { header: "Amount", accessor: (row) => `₹${row.amount.toLocaleString("en-IN")}` },
            { header: "Method", accessor: (row) => row.method ?? "—" },
            { header: "Date", accessor: (row) => new Date(row.createdAt).toLocaleDateString("en-IN") },
            { header: "Status", accessor: (row) => <Badge tone={statusTone(row.status)}>{statusLabel(row.status)}</Badge> },
          ]}
        />
      )}
    </div>
  );
}
