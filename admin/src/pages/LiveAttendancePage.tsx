import { useState } from "react";
import { ScanLine, Users2, Percent } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { DataTable } from "@/components/data-table";
import { Select } from "@/components/select";
import { LoadingState, ErrorState } from "@/components/query-states";
import { useAdminEvents, useCheckinHistory, useLiveAttendance } from "@/lib/queries";
import type { CheckInItem } from "@/types/api";

export default function LiveAttendancePage() {
  const { data: events } = useAdminEvents();
  const [eventId, setEventId] = useState<string>();
  const activeEventId = eventId ?? events?.[0]?._id;

  const { data: stats, isLoading, isError } = useLiveAttendance(activeEventId);
  const { data: checkIns } = useCheckinHistory();

  const recent = checkIns?.filter((c) => {
    const ticket = c.ticket as CheckInItem["ticket"];
    return typeof ticket !== "string";
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Live Attendance"
        description="Real-time check-in feed."
        action={
          <Select
            aria-label="Choose event"
            className="w-64"
            value={activeEventId ?? ""}
            onChange={setEventId}
            options={events?.map((e) => ({ value: e._id, label: e.title })) ?? []}
            placeholder="Choose an event"
          />
        }
      />

      {isLoading && <LoadingState />}
      {isError && <ErrorState />}
      {stats && (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Checked In" value={stats.checkedIn.toLocaleString("en-IN")} icon={ScanLine} accent="teal" />
          <StatCard label="Remaining" value={stats.remaining.toLocaleString("en-IN")} icon={Users2} accent="gold" />
          <StatCard label="Check-in Rate" value={`${stats.rate}%`} icon={Percent} accent="terracotta" />
        </div>
      )}

      <div>
        <p className="mb-3 text-sm font-semibold text-teal">Recent Check-ins</p>
        <DataTable
          rows={recent?.slice(0, 20) ?? []}
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
            { header: "Time", accessor: (row) => new Date(row.createdAt).toLocaleTimeString("en-IN") },
            { header: "Gate", accessor: (row) => row.gate ?? "—" },
          ]}
        />
      </div>
    </div>
  );
}
