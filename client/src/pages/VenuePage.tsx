import { MapPin, Car, Navigation, Phone } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/section";
import { LoadingState, ErrorState, EmptyState } from "@/components/query-states";
import { useEvents } from "@/lib/queries";
import { usePageTitle } from "@/lib/use-page-title";
import { formatCurrency } from "@/lib/format";
import { media } from "@/lib/media";

export default function VenuePage() {
  usePageTitle("Venue", "Everything you need to know about the Kasepu Kalisi venue.");
  const { data: events, isLoading, isError } = useEvents();
  const venue = (events?.find((e) => e.status === "registration_open") ?? events?.[0])?.venue;

  return (
    <>
      <PageHero
        eyebrow="Venue"
        image={media.wineToast}
        title={
          <>
            Find your way
            <br />
            <span className="italic text-gold">to the table.</span>
          </>
        }
      />

      <Section>
        {isLoading && <LoadingState label="Loading venue details…" />}
        {isError && <ErrorState message="Couldn't load venue details." />}
        {!isLoading && !venue && <EmptyState message="Venue details will appear here once a gathering is announced." />}

        {venue && (
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-12">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
              <img src={media.loungeInterior} alt={venue.name} className="h-full w-full object-cover" />
              <span className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-teal/90 px-3.5 py-2 text-xs font-semibold text-ivory">
                <MapPin size={14} className="text-gold" />
                {venue.city}
              </span>
            </div>

            <div>
              <h2 className="text-3xl">{venue.name}</h2>
              <p className="mt-2 text-sm text-slate">{venue.address}</p>

              <div className="mt-8 flex flex-col gap-6">
                {venue.parkingAvailable && (
                  <div className="flex gap-3">
                    <Car size={18} className="mt-0.5 shrink-0 text-gold" />
                    <p className="text-sm leading-relaxed text-slate">
                      {venue.parkingInstructions ??
                        `Parking available${venue.parkingFee ? ` — ${formatCurrency(venue.parkingFee)} per vehicle` : ""}.`}
                    </p>
                  </div>
                )}
                {venue.directions && (
                  <div className="flex gap-3">
                    <Navigation size={18} className="mt-0.5 shrink-0 text-gold" />
                    <p className="text-sm leading-relaxed text-slate">{venue.directions}</p>
                  </div>
                )}
                {venue.contactNumber && (
                  <div className="flex gap-3">
                    <Phone size={18} className="mt-0.5 shrink-0 text-gold" />
                    <p className="text-sm leading-relaxed text-slate">{venue.contactNumber}</p>
                  </div>
                )}
              </div>

              {venue.landmarks && venue.landmarks.length > 0 && (
                <div className="mt-8 border-t border-slate/10 pt-6">
                  <p className="eyebrow text-gold">Nearby Landmarks</p>
                  <ul className="mt-3 flex flex-col gap-1.5">
                    {venue.landmarks.map((landmark) => (
                      <li key={landmark} className="text-sm text-slate">
                        {landmark}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </Section>
    </>
  );
}
