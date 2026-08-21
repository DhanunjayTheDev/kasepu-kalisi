import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/section";
import { EventCard } from "@/components/event-card";
import { LoadingState, ErrorState, EmptyState } from "@/components/query-states";
import { useEvents } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { usePageTitle } from "@/lib/use-page-title";
import { distinctImagesForSlugs, media } from "@/lib/media";

export default function EventsPage() {
  usePageTitle("Gatherings", "Discover upcoming Kasepu Kalisi gatherings across India.");
  const { data: events, isLoading, isError } = useEvents();
  // Guarantees no two cards in the grid land on the same stock photo.
  const images = distinctImagesForSlugs((events ?? []).map((e) => e.slug));

  return (
    <>
      <PageHero
        eyebrow="All Gatherings"
        image={media.buffetSpread}
        title={
          <>
            Every gathering,
            <br />
            <span className="italic text-gold">one shared table.</span>
          </>
        }
        description="From Bengaluru to Chennai, each Kasepu Kalisi gathering is curated in small numbers so the evening stays personal."
      />
      <Section>
        {isLoading && <LoadingState label="Loading gatherings…" />}
        {isError && <ErrorState message="Couldn't load gatherings. Please try again." />}
        {events && events.length === 0 && <EmptyState message="No gatherings are open right now — check back soon." />}
        {events && events.length > 0 && (
          <>
            <p className="mb-6 font-sans text-sm text-slate">
              {events.length} {events.length === 1 ? "gathering" : "gatherings"} · seats are capped, so they fill quickly
            </p>
            {/* A lone gathering gets a wide card — a 2-up grid would leave half the row empty. */}
            {events.length === 1 ? (
              <EventCard event={events[0]} size="wide" image={images[events[0].slug]} />
            ) : (
              <div
                className={cn(
                  "grid gap-5 sm:grid-cols-2 sm:gap-6",
                  events.length > 2 && "lg:grid-cols-3"
                )}
              >
                {events.map((event) => (
                  <EventCard key={event.slug} event={event} image={images[event.slug]} />
                ))}
              </div>
            )}
          </>
        )}
      </Section>
    </>
  );
}
