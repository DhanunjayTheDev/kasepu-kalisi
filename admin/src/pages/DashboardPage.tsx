import { Link } from "react-router-dom";
import { Ticket, Wallet, ScanLine, ClipboardList, ArrowRight, LifeBuoy, Undo2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/badge";
import { LoadingState } from "@/components/query-states";
import {
  useAdminBookings,
  useAdminEvents,
  useAdminRefunds,
  useAttendanceReport,
  useRevenueReport,
  useSupportTickets,
} from "@/lib/queries";
import { statusTone, statusLabel } from "@/lib/status-tone";

function inr(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

export default function DashboardPage() {
  const { data: revenue, isLoading: revenueLoading } = useRevenueReport();
  const { data: attendance } = useAttendanceReport();
  const { data: bookings } = useAdminBookings();
  const { data: events } = useAdminEvents();
  const { data: refunds } = useAdminRefunds();
  const { data: support } = useSupportTickets();

  const netRevenue = revenue?.byEvent.reduce((sum, row) => sum + row.net, 0) ?? 0;
  const ticketsSold = attendance?.byEvent.reduce((sum, row) => sum + row.sold, 0) ?? 0;
  const checkedIn = attendance?.byEvent.reduce((sum, row) => sum + row.checkedIn, 0) ?? 0;
  const bookingCount = bookings?.length ?? 0;

  const pendingRefunds = refunds?.filter((r) => r.status === "requested").length ?? 0;
  const openSupport = support?.filter((t) => t.status !== "resolved").length ?? 0;

  // The events endpoint already sorts by date ascending; status keeps finished
  // gatherings out without needing a clock read during render.
  const upcoming = events?.filter((e) => !["completed", "cancelled"].includes(e.status)).slice(0, 4);

  const recentBookings = bookings?.slice(0, 6);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Dashboard" description="Overview across all Kasepu Kalisi gatherings." />

      {revenueLoading && <LoadingState />}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Tickets Sold" value={ticketsSold.toLocaleString("en-IN")} icon={Ticket} accent="teal" />
        <StatCard label="Net Revenue" value={inr(netRevenue)} icon={Wallet} accent="terracotta" />
        <StatCard label="Checked In" value={checkedIn.toLocaleString("en-IN")} icon={ScanLine} accent="gold" />
        <StatCard label="Bookings" value={bookingCount.toLocaleString("en-IN")} icon={ClipboardList} accent="slate" />
      </div>

      {(pendingRefunds > 0 || openSupport > 0) && (
        <div className="grid gap-4 sm:grid-cols-2">
          {pendingRefunds > 0 && (
            <Link
              to="/bookings/refunds"
              className="flex items-center justify-between rounded-2xl border border-terracotta/20 bg-terracotta/5 p-5 transition-colors hover:bg-terracotta/10"
            >
              <span className="flex items-center gap-3 text-sm font-medium text-terracotta">
                <Undo2 size={17} />
                {pendingRefunds} refund{pendingRefunds === 1 ? "" : "s"} awaiting approval
              </span>
              <ArrowRight size={16} className="text-terracotta" />
            </Link>
          )}
          {openSupport > 0 && (
            <Link
              to="/operations/support"
              className="flex items-center justify-between rounded-2xl border border-gold/30 bg-gold/8 p-5 transition-colors hover:bg-gold/15"
            >
              <span className="flex items-center gap-3 text-sm font-medium text-teal">
                <LifeBuoy size={17} className="text-gold" />
                {openSupport} open support ticket{openSupport === 1 ? "" : "s"}
              </span>
              <ArrowRight size={16} className="text-slate" />
            </Link>
          )}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-teal/10 bg-white p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-teal">Recent Bookings</h2>
            <Link to="/bookings" className="text-xs font-medium text-terracotta hover:underline">
              View all
            </Link>
          </div>

          <div className="mt-4 flex flex-col divide-y divide-teal/5">
            {recentBookings?.length ? (
              recentBookings.map((booking) => (
                <div key={booking._id} className="flex items-center justify-between gap-4 py-3 text-sm">
                  <span className="font-mono text-xs text-slate">{booking.bookingId}</span>
                  <span className="min-w-0 flex-1 truncate text-teal">{booking.contact.fullName}</span>
                  <span className="shrink-0 text-slate">{inr(booking.total)}</span>
                  <Badge tone={statusTone(booking.status)}>{statusLabel(booking.status)}</Badge>
                </div>
              ))
            ) : (
              <p className="py-6 text-sm text-slate">No bookings yet.</p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-teal/10 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-teal">Upcoming Gatherings</h2>
            <Link to="/events" className="text-xs font-medium text-terracotta hover:underline">
              View all
            </Link>
          </div>

          <div className="mt-4 flex flex-col gap-4">
            {upcoming?.length ? (
              upcoming.map((event) => (
                <Link key={event._id} to={`/events/${event._id}/edit`} className="group flex flex-col gap-1">
                  <span className="text-sm font-medium text-teal group-hover:text-terracotta">{event.title}</span>
                  <span className="text-xs text-slate">
                    {new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} ·{" "}
                    {event.city}
                  </span>
                </Link>
              ))
            ) : (
              <p className="py-4 text-sm text-slate">Nothing scheduled yet.</p>
            )}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-teal/10 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-teal">Revenue by Gathering</h2>
          <Link to="/reports/revenue" className="text-xs font-medium text-terracotta hover:underline">
            Full report
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-teal/10 text-xs uppercase tracking-wide text-slate">
                <th className="py-2.5 pr-4 font-semibold">Gathering</th>
                <th className="py-2.5 pr-4 font-semibold">Gross</th>
                <th className="py-2.5 pr-4 font-semibold">Discounts</th>
                <th className="py-2.5 pr-4 font-semibold">Tax</th>
                <th className="py-2.5 font-semibold">Net</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-teal/5">
              {revenue?.byEvent.length ? (
                revenue.byEvent.map((row) => (
                  <tr key={row._id}>
                    <td className="py-3 pr-4 text-teal">{row.event?.title ?? "—"}</td>
                    <td className="py-3 pr-4 text-slate">{inr(row.gross)}</td>
                    <td className="py-3 pr-4 text-slate">{inr(row.discounts)}</td>
                    <td className="py-3 pr-4 text-slate">{inr(row.tax)}</td>
                    <td className="py-3 font-semibold text-teal">{inr(row.net)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-sm text-slate">
                    No revenue recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {revenue && revenue.totalRefunded > 0 && (
          <p className="mt-4 text-xs text-slate">Total refunded to date: {inr(revenue.totalRefunded)}</p>
        )}
      </section>
    </div>
  );
}
