import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { EventCard } from "@/components/event-card";
import { LoadingState, EmptyState } from "@/components/query-states";
import { useEvents } from "@/lib/queries";
import { distinctImagesForSlugs } from "@/lib/media";

// A finished or called-off evening is not an upcoming gathering.
const PAST_STATUSES = ["completed", "cancelled"];

export function UpcomingGatherings() {
  const { data: events, isLoading } = useEvents();

  const upcoming = (events ?? []).filter((e) => !PAST_STATUSES.includes(e.status));
  const [feature, ...rest] = upcoming;
  const images = distinctImagesForSlugs(upcoming.map((e) => e.slug));

  return (
    <section id="gatherings" className="scroll-mt-20 py-14 sm:py-20 lg:py-28">
      <div className="container-kk">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-lg">
            <span className="eyebrow text-gold">Upcoming Gatherings</span>
            <h2 className="mt-4 text-[2rem] leading-tight xs:text-4xl sm:text-5xl">
              The next few
              <br />
              <span className="italic text-terracotta">beautiful hours.</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate">
              Each evening is planned end to end — the menu, the music, the seating — so all you have to do is show up.
            </p>
          </div>

          <Link
            to="/events"
            className="group/all flex shrink-0 items-center gap-2 font-sans text-sm font-semibold text-teal transition-colors hover:text-terracotta"
          >
            All gatherings
            <ArrowRight
              size={15}
              className="transition-transform duration-300 group-hover/all:translate-x-1"
            />
          </Link>
        </motion.div>

        {isLoading && <LoadingState label="Loading gatherings…" />}
        {!isLoading && !feature && (
          <EmptyState message="No gatherings are open right now — check back soon." />
        )}

        {feature && (
          <div className="mt-10 flex flex-col gap-5 sm:mt-14 sm:gap-6">
            {/* Soonest evening leads as a wide card. The old layout stretched it
                across two rows, which left a large void under short content. */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <EventCard event={feature} size="wide" image={images[feature.slug]} />
            </motion.div>

            {rest.length > 0 && (
              <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
                {rest.map((event, index) => (
                  <motion.div
                    key={event.slug}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
                  >
                    <EventCard event={event} image={images[event.slug]} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
