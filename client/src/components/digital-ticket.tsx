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

  return (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-slate/15 bg-white sm:rounded-[2rem]">
      <div className="bg-teal p-6 text-center sm:p-8">
        <Logo mono className="mx-auto h-11" />
        <p className="mt-5 font-display text-2xl text-ivory">{ticket.eventTitle}</p>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-gold">{ticket.ticketTypeName} Ticket</p>
      </div>

      <div className="flex flex-col items-center gap-1.5 border-b border-dashed border-slate/20 px-8 py-6 font-sans text-sm text-slate">
        <span className="flex items-center gap-2">
          <CalendarDays size={15} className="text-gold" />
          {ticket.date}
        </span>
        {ticket.time && (
          <span className="flex items-center gap-2">
            <Clock size={15} className="text-gold" />
            {ticket.time}
          </span>
        )}
        <span className="flex items-center gap-2">
          <MapPin size={15} className="text-gold" />
          {ticket.venueName}, {ticket.venueCity}
        </span>
      </div>

      <div className="flex flex-col items-center gap-4 px-8 py-8">
        <div className="rounded-2xl border border-slate/15 p-4">
          <QRCodeSVG value={ticket.qrValue} size={168} fgColor="#1E6C71" />
        </div>
        <p className="font-sans text-sm font-semibold tracking-wide text-teal">{ticket.ticketId}</p>
        <p className="font-sans text-xs text-slate">Booking {ticket.bookingId}</p>
        <p className="font-sans text-sm text-teal">{ticket.attendeeName}</p>
        {ticket.status !== "active" && (
          <p className="font-sans text-xs font-semibold uppercase tracking-wide text-terracotta">{ticket.status}</p>
        )}
      </div>

      <div className="flex gap-3 border-t border-slate/10 px-8 py-6">
        <Button type="button" variant="outline" className="flex-1" onClick={() => window.print()}>
          <Download size={16} /> Download
        </Button>
        <Button type="button" variant="ghost" className="flex-1" onClick={handleShare}>
          <Share2 size={16} /> Share
        </Button>
      </div>
    </div>
  );
}
