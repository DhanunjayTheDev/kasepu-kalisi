import { motion } from "framer-motion";
import { EventCard } from "@/components/event-card";
import { LoadingState, EmptyState } from "@/components/query-states";
import { useEvents } from "@/lib/queries";

export function UpcomingGatherings() {
  const { data: events, isLoading } = useEvents();
  const [first, ...rest] = events ?? [];

  return (
    <section id="gatherings" className="scroll-mt-20 py-14 sm:py-20 lg:py-28">
      <div className="container-kk">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-lg"
        >
          <span className="eyebrow text-gold">Upcoming Gatherings</span>
          <h2 className="mt-4 text-[2rem] leading-tight xs:text-4xl sm:text-5xl">
            The next few
            <br />
            <span className="italic">beautiful hours.</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate">
            Each evening is planned end to end — the menu, the music, the seating — so all you have to do is show up.
          </p>
        </motion.div>

        {isLoading && <LoadingState label="Loading gatherings…" />}
        {!isLoading && !first && <EmptyState message="No gatherings are open right now — check back soon." />}

        {first && (
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="lg:row-span-2"
            >
              <EventCard event={first} size="large" />
            </motion.div>

            {rest.map((event, index) => (
              <motion.div
                key={event.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
