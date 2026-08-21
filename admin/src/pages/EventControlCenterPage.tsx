import { useState } from "react";
import { Ticket, ScanLine, Users2, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/badge";
import { Select } from "@/components/select";
import { LoadingState } from "@/components/query-states";
import { useAdminEvents, useAnnouncements, useCheckinHistory, useLiveAttendance } from "@/lib/queries";
import type { EventItem } from "@/types/api";

export default function EventControlCenterPage() {
  const { data: events } = useAdminEvents();
  const [eventId, setEventId] = useState<string>();
  const activeEventId = eventId ?? events?.[0]?._id;
  const activeEvent = events?.find((e) => e._id === activeEventId);

  const { data: stats, isLoading } = useLiveAttendance(activeEventId);
  const { data: checkIns } = useCheckinHistory();
  const { data: announcements } = useAnnouncements();

  const recentForEvent = checkIns?.filter((c) => {
    const event = c.event as EventItem | string | undefined;
    return typeof event === "object" && event?._id === activeEventId;
  });
  const latestAnnouncement = announcements?.find((a) => {
    const event = a.event as EventItem | string;
    return (typeof event === "string" ? event : event._id) === activeEventId;
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Event Control Center"
        description={activeEvent ? `${activeEvent.title} — live operations.` : "Live operations for tonight's gathering."}
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
      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Tickets Sold" value={stats.totalTickets.toLocaleString("en-IN")} icon={Ticket} accent="teal" />
          <StatCard label="Checked In" value={stats.checkedIn.toLocaleString("en-IN")} icon={ScanLine} accent="gold" />
          <StatCard label="Remaining" value={stats.remaining.toLocaleString("en-IN")} icon={Users2} accent="slate" />
          <StatCard label="Check-in Rate" value={`${stats.rate}%`} icon={TrendingUp} accent="terracotta" />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-teal/10 bg-white p-6">
          <p className="text-sm font-semibold text-teal">Recent Check-ins</p>
          <div className="mt-4 flex flex-col divide-y divide-teal/5">
            {recentForEvent && recentForEvent.length > 0 ? (
              recentForEvent.slice(0, 10).map((row) => (
                <div key={row._id} className="flex items-center justify-between py-3 text-sm">
                  <span className="font-mono text-xs text-slate">{(row.ticket as { ticketId: string }).ticketId}</span>
                  <span className="text-teal">{(row.ticket as { attendee?: { name: string } }).attendee?.name ?? "—"}</span>
                  <span className="text-slate">{new Date(row.createdAt).toLocaleTimeString("en-IN")}</span>
                  <Badge tone="teal">Approved</Badge>
                </div>
              ))
            ) : (
              <p className="py-6 text-sm text-slate">No check-ins yet.</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {latestAnnouncement ? (
            <div className="rounded-2xl border border-terracotta/20 bg-terracotta/5 p-6">
              <p className="text-sm font-semibold text-terracotta">Latest Announcement</p>
              <p className="mt-2 text-sm text-teal">{latestAnnouncement.content}</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-teal/10 bg-white p-6">
              <p className="text-sm text-slate">No announcements posted for this gathering yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
