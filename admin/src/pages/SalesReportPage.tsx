import { Ticket, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { MiniBarChart } from "@/components/mini-bar-chart";
import { DataTable } from "@/components/data-table";
import { LoadingState, ErrorState } from "@/components/query-states";
import { useAdminEvents, useSalesReport, useTicketTypes } from "@/lib/queries";

export default function SalesReportPage() {
  const { data: report, isLoading, isError } = useSalesReport();
  const { data: ticketTypes } = useTicketTypes();
  const { data: events } = useAdminEvents();

  const ticketTypeById = new Map(ticketTypes?.map((t) => [t._id, t]));
  const eventTitleById = new Map(events?.map((e) => [e._id, e.title]));

  const totalTickets = report?.byTicketType.reduce((sum, row) => sum + row.tickets, 0) ?? 0;
  const totalRevenue = report?.byTicketType.reduce((sum, row) => sum + row.revenue, 0) ?? 0;

  const chartData =
    report?.byDay.map((row) => ({ label: new Date(row._id).toLocaleDateString("en-IN", { weekday: "short" }), value: row.tickets })) ?? [];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Sales" description="Ticket sales across all gatherings." />

      {isLoading && <LoadingState />}
      {isError && <ErrorState />}

      {report && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard label="Tickets Sold" value={totalTickets.toLocaleString("en-IN")} icon={Ticket} accent="teal" />
            <StatCard label="Total Revenue" value={`₹${totalRevenue.toLocaleString("en-IN")}`} icon={TrendingUp} accent="terracotta" />
          </div>

          {chartData.length > 0 && (
            <div className="rounded-2xl border border-teal/10 bg-white p-6">
              <p className="text-sm font-semibold text-teal">Sales by Day</p>
              <div className="mt-6">
                <MiniBarChart data={chartData} />
              </div>
            </div>
          )}

          <div>
            <p className="mb-3 text-sm font-semibold text-teal">Sales by Ticket Type</p>
            <DataTable
              rows={report.byTicketType}
              rowKey={(row) => row._id}
              columns={[
                {
                  header: "Ticket Type",
                  accessor: (row) => {
                    const tt = ticketTypeById.get(row._id);
                    const eventTitle = tt ? eventTitleById.get(tt.event as string) : undefined;
                    return `${tt?.name ?? row._id} — ${eventTitle ?? ""}`;
                  },
                },
                { header: "Sold", accessor: (row) => row.tickets },
                { header: "Revenue", accessor: (row) => `₹${row.revenue.toLocaleString("en-IN")}` },
              ]}
            />
          </div>
        </>
      )}
    </div>
  );
}
