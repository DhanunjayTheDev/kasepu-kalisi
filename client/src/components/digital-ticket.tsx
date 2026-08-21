import { QRCodeSVG } from "qrcode.react";
import { CalendarDays, Clock, MapPin, Download, Share2 } from "lucide-react";
import { Button } from "@/components/button";
import { Logo } from "@/components/logo";

interface DigitalTicketProps {
  ticketId: string;
  bookingId: string;
  attendeeName: string;
  ticketTypeName: string;
  eventTitle: string;
  date: string;
  time?: string;
  venueName: string;
  venueCity: string;
  qrValue: string;
  status: string;
}

export function DigitalTicket(ticket: DigitalTicketProps) {
  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      await navigator.share({
        title: ticket.eventTitle,
        text: `My ticket for ${ticket.eventTitle}`,
      });
    }
  }

  const isActive = ticket.status === "active";

  return (
    <div className="mx-auto w-full max-w-md">
      {/* Shaped like a real stub: teal counterfoil up top, a punched
          perforation line, then the scannable half. */}
      <div className="relative isolate overflow-hidden rounded-3xl bg-white shadow-[0_2px_30px_rgba(30,108,113,0.10)]">
        <div className="grain relative isolate bg-teal px-6 pb-9 pt-7 text-center sm:px-8">
          <svg
            aria-hidden
            viewBox="0 0 200 200"
            className="pointer-events-none absolute -right-12 -top-14 h-44 w-44 text-gold/20"
            fill="none"
          >
            <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="1" />
            <circle cx="100" cy="100" r="62" stroke="currentColor" strokeWidth="1" />
          </svg>

          <Logo mono className="relative mx-auto h-10" />

          <p className="relative mt-5 font-display text-2xl leading-snug text-ivory">{ticket.eventTitle}</p>

          <span className="relative mt-3 inline-flex items-center rounded-full bg-ivory/12 px-3 py-1 font-sans text-[11px] font-semibold uppercase tracking-wider text-gold">
            {ticket.ticketTypeName}
          </span>

          <div className="relative mt-6 flex flex-col items-center gap-1.5 font-sans text-sm text-ivory/75">
            <span className="flex items-center gap-2">
              <CalendarDays size={14} className="text-gold" />
              {ticket.date}
            </span>
            {ticket.time && (
              <span className="flex items-center gap-2">
                <Clock size={14} className="text-gold" />
                {ticket.time}
              </span>
            )}
            <span className="flex items-center gap-2 text-center">
              <MapPin size={14} className="shrink-0 text-gold" />
              {ticket.venueName}, {ticket.venueCity}
            </span>
          </div>
        </div>

        {/* Perforation: two punched notches with a dashed rule between them. */}
        <div className="relative h-0">
          <span
            aria-hidden
            className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-ivory"
          />
          <span
            aria-hidden
            className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-ivory"
          />
          <span
            aria-hidden
            className="absolute inset-x-6 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-slate/25"
          />
        </div>

        <div className="flex flex-col items-center px-6 pb-8 pt-9 sm:px-8">
          <div className="rounded-2xl border border-slate/15 bg-white p-4">
            <QRCodeSVG value={ticket.qrValue} size={168} fgColor="#1E6C71" bgColor="#FFFFFF" />
          </div>

          <p className="mt-5 font-sans text-base font-semibold tracking-[0.08em] text-teal">{ticket.ticketId}</p>

          <div className="mt-5 grid w-full grid-cols-2 gap-4 border-t border-slate/10 pt-5 text-center">
            <div>
              <p className="eyebrow text-slate/70">Guest</p>
              <p className="mt-1 truncate font-sans text-sm font-medium text-teal">{ticket.attendeeName}</p>
            </div>
            <div>
              <p className="eyebrow text-slate/70">Booking</p>
              <p className="mt-1 truncate font-mono text-xs text-teal">{ticket.bookingId}</p>
            </div>
          </div>

          {!isActive && (
            <p className="mt-5 w-full rounded-lg bg-terracotta/8 py-2 text-center font-sans text-xs font-semibold uppercase tracking-wider text-terracotta">
              {ticket.status}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <Button type="button" variant="outline" className="flex-1" onClick={() => window.print()}>
          <Download size={16} /> Download
        </Button>
        <Button type="button" variant="ghost" className="flex-1" onClick={handleShare}>
          <Share2 size={16} /> Share
        </Button>
      </div>

      <p className="mt-4 text-center text-xs leading-relaxed text-slate">
        Show this QR at the gate. One scan admits {ticket.attendeeName.split(" ")[0]}.
      </p>
    </div>
  );
}
