import { Link } from "react-router-dom";
import { CalendarDays, Clock, MapPin, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate, formatCurrency } from "@/lib/format";
import { imageForSlug } from "@/lib/media";
import type { EventItem } from "@/types/api";
import type { EventStatus } from "@/types/event";

const STATUS_LABEL: Record<EventStatus, string> = {
  draft: "Draft",
  published: "Announced",
  registration_open: "Booking Open",
  sold_out: "Sold Out",
  registration_closed: "Registration Closed",
  completed: "Past Gathering",
  postponed: "Postponed",
  cancelled: "Cancelled",
};

const STATUS_STYLE: Record<EventStatus, string> = {
  draft: "bg-slate text-ivory",
  published: "bg-teal text-ivory",
  registration_open: "bg-terracotta text-ivory",
  sold_out: "bg-slate text-ivory",
  registration_closed: "bg-slate text-ivory",
  completed: "bg-slate text-ivory",
  postponed: "bg-gold text-teal",
  cancelled: "bg-slate text-ivory",
};

interface EventCardProps {
  event: EventItem;
  /** "wide" lays the card out side-by-side from sm up, for a lone featured gathering. */
  size?: "large" | "compact" | "wide";
  /** Overrides the hashed photo so a list can guarantee distinct imagery. */
  image?: string;
}

export function EventCard({ event, size = "compact", image }: EventCardProps) {
  const isLarge = size === "large";
  const isWide = size === "wide";
  const status = event.status as EventStatus;
  const disabled = ["sold_out", "registration_closed", "cancelled", "completed"].includes(status);

  return (
    <article
      className={cn(
        "group flex h-full overflow-hidden rounded-2xl border border-slate/15 bg-white transition-shadow duration-300 hover:shadow-[0_2px_24px_rgba(30,108,113,0.10)]",
        // The wide band needs an explicit height: with an auto-height row the
        // image's h-full resolves against nothing and it renders at full size.
        isWide ? "flex-col sm:h-[19rem] sm:flex-row lg:h-[21rem]" : "flex-col"
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden",
          isWide
            ? "aspect-[4/3] sm:aspect-auto sm:h-full sm:w-[45%] sm:shrink-0"
            : isLarge
              ? "aspect-[16/10]"
              : "aspect-[4/3]"
        )}
      >
        <img
          src={image ?? imageForSlug(event.slug)}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <span
          className={cn(
            "absolute left-4 top-4 rounded-full px-3 py-1 font-sans text-[11px] font-semibold uppercase tracking-wider",
            STATUS_STYLE[status]
          )}
        >
          {STATUS_LABEL[status]}
        </span>

        <span className="absolute bottom-4 left-4 flex flex-col items-center rounded-xl bg-ivory px-3.5 py-2 text-center">
          <span className="font-display text-2xl leading-none text-teal">
            {new Date(event.date).toLocaleDateString("en-IN", { day: "numeric" })}
          </span>
          <span className="mt-0.5 font-sans text-[10px] font-semibold uppercase tracking-wider text-terracotta">
            {new Date(event.date).toLocaleDateString("en-IN", { month: "short" })}
          </span>
        </span>
      </div>

      <div className={cn("flex flex-1 flex-col p-7", (isLarge || isWide) && "sm:p-9")}>
        <h3 className={cn("leading-tight text-teal", isLarge || isWide ? "text-2xl sm:text-3xl lg:text-4xl" : "text-2xl")}>
          {event.title}
        </h3>

        {event.tagline && (
          <p className="mt-3 text-sm leading-relaxed text-slate">{event.tagline}</p>
        )}

        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 font-sans text-xs text-slate">
          <span className="flex items-center gap-1.5">
            <CalendarDays size={14} className="text-gold" />
            {formatDate(event.date)}
          </span>
          {event.startTime && (
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-gold" />
              {event.startTime}
              {event.endTime ? ` — ${event.endTime}` : ""}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <MapPin size={14} className="text-gold" />
            {event.venue.name}, {event.city}
          </span>
        </div>

        {/* The wide band has room for the full pitch; compact cards don't. */}
        {isWide && event.description && (
          <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-slate/85">{event.description}</p>
        )}

        <div className="mt-auto flex items-center justify-between gap-4 border-t border-slate/12 pt-6">
          <span className="font-sans text-sm text-slate">
            From <span className="font-semibold text-teal">{formatCurrency(event.priceFrom)}</span>
          </span>

          {disabled ? (
            <span className="font-sans text-sm font-semibold text-slate/60">{STATUS_LABEL[status]}</span>
          ) : (
            <Link
              to={`/events/${event.slug}`}
              className="group/cta relative flex items-center gap-1.5 font-sans text-sm font-semibold text-terracotta transition-colors hover:text-teal"
            >
              <span className="relative">
                Discover the evening
                {/* Underline wipes in from the left on hover/focus. */}
                <span
                  aria-hidden
                  className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover/cta:scale-x-100 group-focus-visible/cta:scale-x-100"
                />
              </span>
              <ArrowRight
                size={15}
                className="transition-transform duration-300 ease-out group-hover/cta:translate-x-1.5 group-focus-visible/cta:translate-x-1.5"
              />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
