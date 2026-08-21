import { useState } from "react";
import { motion } from "framer-motion";
import { Car, Compass, MapPin, Phone, Train, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/button";
import { LoadingState, ErrorState, EmptyState } from "@/components/query-states";
import { useEvents } from "@/lib/queries";
import { usePageTitle } from "@/lib/use-page-title";
import { formatCurrency, formatDate } from "@/lib/format";
import { media } from "@/lib/media";
import { cn } from "@/lib/utils";
import type { EventItem } from "@/types/api";

function VenueFact({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Car;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative isolate overflow-hidden rounded-2xl border border-slate/12 bg-white p-6 sm:p-7">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-teal/8 text-teal">
        <Icon size={18} strokeWidth={1.7} />
      </span>
      <p className="eyebrow mt-5 text-gold">{label}</p>
      <div className="mt-2 text-sm leading-relaxed text-slate">{children}</div>
    </div>
  );
}

export default function VenuePage() {
  usePageTitle("Venue", "Everything you need to know about the Kasepu Kalisi venue.");
  const { data: events, isLoading, isError } = useEvents();

  // Venues are per-gathering, so the page has to let you pick which one —
  // the old version silently pinned to a single event's venue.
  const withVenue = (events ?? []).filter((e) => e.venue?.name);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const active: EventItem | undefined =
    withVenue.find((e) => e._id === selectedId) ??
    withVenue.find((e) => e.status === "registration_open") ??
    withVenue[0];

  const venue = active?.venue;

  return (
    <>
      {/* Full-bleed venue portrait. The name sits over the image, not above it. */}
      <section className="relative isolate flex min-h-[52vh] items-end overflow-hidden sm:min-h-[62vh]">
        <img
          src={media.loungeInterior}
          alt=""
          loading="eager"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-teal/78" />

        <svg
          aria-hidden
          viewBox="0 0 400 400"
          className="pointer-events-none absolute -right-28 -top-32 -z-10 h-[26rem] w-[26rem] text-gold/20"
          fill="none"
        >
          <circle cx="200" cy="200" r="185" stroke="currentColor" strokeWidth="1" />
          <circle cx="200" cy="200" r="140" stroke="currentColor" strokeWidth="1" />
          <circle cx="200" cy="200" r="95" stroke="currentColor" strokeWidth="1" />
        </svg>

        <div className="container-kk relative w-full py-14 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="eyebrow flex items-center gap-3 text-gold">
              <span className="rule-gold" aria-hidden />
              The Venue
            </span>

            <h1 className="mt-5 max-w-3xl text-[2.1rem] leading-[1.05] text-ivory xs:text-4xl sm:text-5xl lg:text-6xl">
              Find your way
              <br />
              <span className="italic text-gold">to the table.</span>
            </h1>

            {venue && (
              <p className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-sans text-sm text-ivory/80">
                <span className="flex items-center gap-2">
                  <MapPin size={15} className="text-gold" />
                  {venue.name}, {venue.city}
                </span>
                {active && <span className="text-ivory/50">·</span>}
                {active && <span>{formatDate(active.date)}</span>}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      <div className="container-kk py-12 sm:py-16 lg:py-20">
        {isLoading && <LoadingState label="Loading venue details…" />}
        {isError && <ErrorState message="Couldn't load venue details." />}
        {!isLoading && !venue && (
          <EmptyState message="Venue details will appear here once a gathering is announced." />
        )}

        {venue && active && (
          <>
            {/* Each gathering has its own venue — switch between them. */}
            {withVenue.length > 1 && (
              <div className="mb-10 flex flex-wrap gap-2.5 sm:mb-14">
                {withVenue.map((e) => {
                  const isActive = e._id === active._id;
                  return (
                    <button
                      key={e._id}
                      type="button"
                      onClick={() => setSelectedId(e._id)}
                      aria-pressed={isActive}
                      className={cn(
                        "cursor-pointer rounded-full border px-4 py-2 font-sans text-sm font-medium transition-colors",
                        isActive
                          ? "border-teal bg-teal text-ivory"
                          : "border-slate/25 text-slate hover:border-teal/50 hover:text-teal"
                      )}
                    >
                      {e.city}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-14">
              <div>
                <span className="numeral text-5xl sm:text-6xl">01</span>
                <h2 className="mt-3 text-3xl leading-tight sm:text-4xl">{venue.name}</h2>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-slate">{venue.address}</p>

                <div className="mt-9 grid gap-4 sm:grid-cols-2">
                  <VenueFact icon={Car} label="Parking">
                    {venue.parkingAvailable
                      ? (venue.parkingInstructions ??
                        `Parking available${venue.parkingFee ? ` — ${formatCurrency(venue.parkingFee)} per vehicle` : " at no charge"}.`)
                      : "No on-site parking. We recommend a cab or the nearest metro station."}
                    {venue.parkingAvailable && venue.parkingCapacity ? (
                      <span className="mt-2 block text-xs text-slate/70">
                        Capacity {venue.parkingCapacity} vehicles
                      </span>
                    ) : null}
                  </VenueFact>

                  <VenueFact icon={Train} label="Getting Here">
                    {venue.publicTransport ?? venue.directions ?? "Directions are sent with your ticket a day before."}
                  </VenueFact>

                  {venue.directions && (
                    <VenueFact icon={Compass} label="Directions">
                      {venue.directions}
                    </VenueFact>
                  )}

                  {venue.contactNumber && (
                    <VenueFact icon={Phone} label="Venue Desk">
                      <a href={`tel:${venue.contactNumber.replace(/\s/g, "")}`} className="hover:text-teal">
                        {venue.contactNumber}
                      </a>
                      <span className="mt-2 block text-xs text-slate/70">Reachable on the evening itself</span>
                    </VenueFact>
                  )}
                </div>

                {venue.landmarks && venue.landmarks.length > 0 && (
                  <div className="mt-10 border-t border-slate/12 pt-8">
                    <span className="eyebrow text-gold">Look For</span>
                    <ul className="mt-4 flex flex-col divide-y divide-slate/10">
                      {venue.landmarks.map((landmark) => (
                        <li key={landmark} className="flex items-center gap-3 py-3 text-sm text-slate">
                          <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta" />
                          {landmark}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <aside className="flex flex-col gap-4 lg:sticky lg:top-28 lg:h-fit">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                  <img src={media.loungeInterior} alt={venue.name} className="h-full w-full object-cover" loading="lazy" />
                  <span className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-ivory/95 px-3.5 py-2 font-sans text-xs font-semibold text-teal">
                    <MapPin size={13} className="text-terracotta" />
                    {venue.city}
                  </span>
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venue.name}, ${venue.address}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-slate/15 bg-white p-5 transition-colors hover:border-teal/40"
                >
                  <span>
                    <span className="font-sans text-sm font-semibold text-teal">Open in Maps</span>
                    <span className="mt-0.5 block font-sans text-xs text-slate">Directions from wherever you are</span>
                  </span>
                  <ArrowUpRight
                    size={17}
                    className="shrink-0 text-slate transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-terracotta"
                  />
                </a>

                <div className="relative isolate overflow-hidden rounded-2xl bg-teal p-6">
                  <p className="font-display text-xl leading-snug text-ivory">{active.title}</p>
                  <p className="mt-2 font-sans text-sm text-ivory/70">{formatDate(active.date)}</p>
                  {active.startTime && (
                    <p className="mt-0.5 font-sans text-sm text-ivory/70">
                      Doors {active.startTime}
                      {active.endTime ? ` — ${active.endTime}` : ""}
                    </p>
                  )}
                  <Button
                    href={`/events/${active.slug}`}
                    variant="outline"
                    className="mt-6 w-full border-ivory/60 text-ivory hover:bg-ivory hover:text-teal"
                  >
                    View this gathering
                  </Button>
                </div>
              </aside>
            </div>
          </>
        )}
      </div>
    </>
  );
}
