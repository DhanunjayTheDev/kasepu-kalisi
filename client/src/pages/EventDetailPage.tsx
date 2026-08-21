import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarDays, Clock, MapPin, Play, X } from "lucide-react";
import { Button } from "@/components/button";
import { Section } from "@/components/section";
import { LoadingState } from "@/components/query-states";
import { useArtists, useEvent, useMenuItems, useSchedules, useTicketTypes } from "@/lib/queries";
import { getStatusCta } from "@/lib/event-status";
import { usePageTitle } from "@/lib/use-page-title";
import { formatDate, formatCurrency } from "@/lib/format";
import { artistImageFor, imageForSlug } from "@/lib/media";
import type { EventStatus } from "@/types/event";

function formatCategory(category: string) {
  return category.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function EventDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: event, isLoading, isError } = useEvent(slug);
  const { data: ticketTypes } = useTicketTypes(event?._id);
  const { data: schedule } = useSchedules(event?._id);
  const { data: artists } = useArtists(event?._id);
  const { data: menuItems } = useMenuItems(event?._id);
  const [playingArtist, setPlayingArtist] = useState<string | null>(null);

  usePageTitle(event ? event.title : "Gathering", event?.tagline);

  if (isLoading) {
    return (
      <Section>
        <LoadingState label="Loading gathering…" />
      </Section>
    );
  }

  if (isError || !event) {
    return (
      <Section>
        <p className="text-slate">
          We couldn&apos;t find that gathering. Head back to{" "}
          <Link to="/events" className="text-terracotta underline">
            all gatherings
          </Link>
          .
        </p>
      </Section>
    );
  }

  const cta = getStatusCta(event.status as EventStatus);

  return (
    <>
      <div className="aspect-[16/10] w-full overflow-hidden xs:aspect-[21/9] sm:aspect-[3/1]">
        <img src={imageForSlug(event.slug)} alt="" className="h-full w-full object-cover" loading="eager" />
      </div>

      <section className="border-b border-slate/10">
        <div className="container-kk py-10 sm:py-16 lg:py-20">
          <Link to="/events" className="font-sans text-sm font-medium text-teal/70 hover:text-teal">
            ← All Gatherings
          </Link>

          <span className="eyebrow mt-6 flex items-center gap-3 text-gold">
            <span className="h-px w-8 bg-gold" aria-hidden />
            {formatDate(event.date)} · {event.city}
          </span>

          <h1 className="mt-4 max-w-3xl text-[2.1rem] leading-tight xs:text-4xl sm:mt-5 sm:text-5xl lg:text-6xl">{event.title}</h1>

          <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-slate sm:mt-5 sm:text-lg">{event.tagline}</p>

          <div className="mt-7 flex flex-col gap-2.5 font-sans text-sm text-slate xs:flex-row xs:flex-wrap xs:gap-x-8 xs:gap-y-3">
            <span className="flex items-center gap-2">
              <CalendarDays size={16} className="text-gold" />
              {formatDate(event.date)}
            </span>
            {event.startTime && (
              <span className="flex items-center gap-2">
                <Clock size={16} className="text-gold" />
                {event.startTime} – {event.endTime}
              </span>
            )}
            <span className="flex items-center gap-2">
              <MapPin size={16} className="text-gold" />
              {event.venue.name}, {event.city}
            </span>
          </div>

          {/* Hidden on phones — the sticky bottom bar carries the action there. */}
          <div className="mt-8 hidden md:block">
            <Button href={cta.disabled ? "#" : `/register?event=${event.slug}`} variant="primary" aria-disabled={cta.disabled}>
              {cta.label}
            </Button>
          </div>
        </div>
      </section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
          <div className="lg:col-span-2">
            {event.description && (
              <>
                <h2 className="text-2xl sm:text-3xl">About the evening</h2>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate">{event.description}</p>
              </>
            )}

            {schedule && schedule.length > 0 && (
              <>
                <h2 className="mt-12 text-2xl sm:mt-14 sm:text-3xl">Schedule</h2>
                {/* The rail lives in its own grid column and the dot is centered
                    inside that same column, so marker and line are concentric by
                    construction — no absolute offsets to drift out of sync. */}
                <ol className="mt-6">
                  {schedule.map((item, index) => {
                    const isLast = index === schedule.length - 1;
                    return (
                      <motion.li
                        key={item._id}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.5, delay: index * 0.07, ease: "easeOut" }}
                        className="group grid grid-cols-[1.25rem_1fr] gap-x-4 sm:grid-cols-[1.5rem_1fr] sm:gap-x-5"
                      >
                        <div className="flex flex-col items-center">
                          <motion.span
                            aria-hidden
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.35, delay: index * 0.07 + 0.12, ease: "backOut" }}
                            className="mt-1.5 h-3 w-3 shrink-0 rounded-full bg-terracotta ring-4 ring-terracotta/12 transition-transform duration-300 group-hover:scale-125"
                          />
                          {!isLast && (
                            <motion.span
                              aria-hidden
                              initial={{ scaleY: 0 }}
                              whileInView={{ scaleY: 1 }}
                              viewport={{ once: true, margin: "-60px" }}
                              transition={{ duration: 0.5, delay: index * 0.07 + 0.2, ease: "easeOut" }}
                              style={{ transformOrigin: "top" }}
                              className="mt-2 w-px flex-1 bg-slate/25"
                            />
                          )}
                        </div>

                        <div className={isLast ? "" : "pb-8"}>
                          <span className="inline-flex items-center rounded-full bg-gold/12 px-2.5 py-1 font-sans text-[11px] font-semibold uppercase tracking-wider text-gold">
                            {item.time}
                          </span>
                          <p className="mt-2 font-display text-xl leading-snug text-teal transition-colors duration-300 group-hover:text-terracotta sm:text-2xl">
                            {item.title}
                          </p>
                          {item.description && (
                            <p className="mt-1.5 text-sm leading-relaxed text-slate">{item.description}</p>
                          )}
                        </div>
                      </motion.li>
                    );
                  })}
                </ol>
              </>
            )}

            {artists && artists.length > 0 && (
              <>
                <h2 className="mt-12 text-2xl sm:mt-14 sm:text-3xl">Artists &amp; Bands</h2>
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  {artists.map((artist, index) => (
                    <motion.article
                      key={artist._id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
                      className="group overflow-hidden rounded-2xl border border-slate/12 bg-white"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={artist.photoUrl || artistImageFor(artist.name)}
                          alt={artist.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {artist.genre && (
                          <span className="absolute left-4 top-4 rounded-full bg-ivory/95 px-3 py-1 font-sans text-[11px] font-semibold uppercase tracking-wider text-teal">
                            {artist.genre}
                          </span>
                        )}
                        {artist.videoUrl && (
                          <button
                            type="button"
                            onClick={() => setPlayingArtist(artist._id)}
                            aria-label={`Play ${artist.name}'s set`}
                            className="absolute inset-0 flex cursor-pointer items-center justify-center bg-teal/25 opacity-0 transition-opacity duration-300 group-hover:opacity-100 focus-visible:opacity-100"
                          >
                            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ivory/95 text-terracotta shadow-lg">
                              <Play size={20} fill="currentColor" className="ml-0.5" />
                            </span>
                          </button>
                        )}
                      </div>

                      <div className="p-6">
                        <p className="font-display text-2xl text-teal">{artist.name}</p>
                        {artist.bio && <p className="mt-2 text-sm leading-relaxed text-slate">{artist.bio}</p>}
                        {artist.performanceTime && (
                          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-terracotta">
                            Performing at {artist.performanceTime}
                          </p>
                        )}
                      </div>
                    </motion.article>
                  ))}
                </div>
              </>
            )}

            {menuItems && menuItems.length > 0 && (
              <>
                <h2 className="mt-12 text-2xl sm:mt-14 sm:text-3xl">Dinner</h2>
                <ul className="mt-6 flex flex-col gap-2">
                  {menuItems.map((item) => (
                    <li key={item._id} className="text-sm text-slate">
                      {formatCategory(item.category)} — {item.name}
                    </li>
                  ))}
                </ul>
              </>
            )}

            <h2 className="mt-12 text-2xl sm:mt-14 sm:text-3xl">Venue</h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate">{event.venue.address}</p>
          </div>

          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <div className="rounded-3xl border border-slate/10 bg-teal p-7">
              <span className="eyebrow text-gold">Ticket Options</span>
              <div className="mt-5 flex flex-col gap-4">
                {ticketTypes?.map((ticket) => (
                  <div key={ticket._id} className="rounded-2xl border border-ivory/15 p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-display text-xl text-ivory">{ticket.name}</p>
                      <p className="font-sans text-sm font-semibold text-ivory">{formatCurrency(ticket.price)}</p>
                    </div>
                    {ticket.description && (
                      <p className="mt-1.5 text-xs leading-relaxed text-ivory/70">{ticket.description}</p>
                    )}
                    <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-gold">
                      {(ticket.available ?? ticket.capacity - ticket.sold - ticket.reserved) > 0
                        ? `${ticket.available ?? ticket.capacity - ticket.sold - ticket.reserved} left`
                        : "Sold out"}
                    </p>
                  </div>
                ))}
              </div>
              <Button
                href={cta.disabled ? "#" : `/register?event=${event.slug}`}
                variant="outline"
                className="mt-6 w-full border-ivory/60 text-ivory hover:bg-ivory hover:text-teal"
                aria-disabled={cta.disabled}
              >
                {cta.label}
              </Button>
            </div>
          </aside>
        </div>
      </Section>

      {/* Native-app pattern: the booking action stays reachable above the tab bar. */}
      <div className="fixed inset-x-0 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-30 border-t border-slate/15 bg-ivory/95 px-5 py-3 backdrop-blur-md md:hidden">
        <div className="flex items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="font-sans text-[11px] uppercase tracking-wider text-slate">From</p>
            <p className="font-display text-xl leading-none text-teal">{formatCurrency(event.priceFrom)}</p>
          </div>
          <Button
            href={cta.disabled ? "#" : `/register?event=${event.slug}`}
            variant="primary"
            aria-disabled={cta.disabled}
            className="shrink-0 px-6"
          >
            {cta.label}
          </Button>
        </div>
      </div>
      {/* Spacer so the sticky bar never covers the last of the page content. */}
      <div aria-hidden className="h-20 md:hidden" />

      {playingArtist && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-teal/70 p-4 backdrop-blur-sm"
          onClick={() => setPlayingArtist(null)}
          role="presentation"
        >
          <button
            type="button"
            aria-label="Close video"
            onClick={() => setPlayingArtist(null)}
            className="absolute right-5 top-5 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-ivory/95 text-teal transition-colors hover:bg-ivory"
          >
            <X size={20} />
          </button>
          <video
            src={artists?.find((a) => a._id === playingArtist)?.videoUrl}
            controls
            autoPlay
            onClick={(e) => e.stopPropagation()}
            className="max-h-[80vh] w-full max-w-4xl rounded-2xl"
          />
        </div>
      )}
    </>
  );
}
