import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/data-table";
import { LoadingState, ErrorState } from "@/components/query-states";
import { useAttendanceReport } from "@/lib/queries";

export default function AttendanceReportPage() {
  const { data: report, isLoading, isError } = useAttendanceReport();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Attendance" description="Check-in rate by gathering." />

      {isLoading && <LoadingState />}
      {isError && <ErrorState />}
      {report && (
        <DataTable
          rows={report.byEvent}
          rowKey={(row) => row._id}
          columns={[
            { header: "Event", accessor: (row) => row.event?.title ?? row._id },
            { header: "Sold", accessor: (row) => row.sold.toLocaleString("en-IN") },
            { header: "Checked In", accessor: (row) => row.checkedIn.toLocaleString("en-IN") },
            {
              header: "Rate",
              accessor: (row) => (
                <span className="font-semibold">{row.sold > 0 ? Math.round((row.checkedIn / row.sold) * 100) : 0}%</span>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}
