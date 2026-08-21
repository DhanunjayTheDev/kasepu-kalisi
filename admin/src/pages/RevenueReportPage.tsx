import { Wallet, Receipt, TrendingDown, PiggyBank } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { DataTable } from "@/components/data-table";
import { LoadingState, ErrorState } from "@/components/query-states";
import { useRevenueReport } from "@/lib/queries";

export default function RevenueReportPage() {
  const { data: report, isLoading, isError } = useRevenueReport();

  const totals = (report?.byEvent ?? []).reduce(
    (acc, row) => ({
      gross: acc.gross + row.gross,
      discounts: acc.discounts + row.discounts,
      tax: acc.tax + row.tax,
      net: acc.net + row.net,
    }),
    { gross: 0, discounts: 0, tax: 0, net: 0 }
  );

  const inr = (n: number) => `₹${(n / 100000).toFixed(1)}L`;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Revenue" description="Gross revenue, discounts, taxes and net across gatherings." />

      {isLoading && <LoadingState />}
      {isError && <ErrorState />}

      {report && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Gross" value={inr(totals.gross)} icon={Wallet} accent="teal" />
            <StatCard label="Discounts" value={inr(totals.discounts)} icon={TrendingDown} accent="gold" />
            <StatCard label="Taxes" value={inr(totals.tax)} icon={Receipt} accent="slate" />
            <StatCard label="Net" value={inr(totals.net)} icon={PiggyBank} accent="terracotta" />
          </div>

          <DataTable
            rows={report.byEvent}
            rowKey={(row) => row._id}
            columns={[
              { header: "Event", accessor: (row) => row.event?.title ?? row._id },
              { header: "Gross", accessor: (row) => `₹${row.gross.toLocaleString("en-IN")}` },
              { header: "Discounts", accessor: (row) => `₹${row.discounts.toLocaleString("en-IN")}` },
              { header: "Tax", accessor: (row) => `₹${row.tax.toLocaleString("en-IN")}` },
              { header: "Net", accessor: (row) => <span className="font-semibold">₹{row.net.toLocaleString("en-IN")}</span> },
            ]}
          />
        </>
      )}
    </div>
  );
}
