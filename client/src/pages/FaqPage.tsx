import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/section";
import { Accordion } from "@/components/accordion";
import { Button } from "@/components/button";
import { LoadingState, ErrorState, EmptyState } from "@/components/query-states";
import { useFaqItems } from "@/lib/queries";
import { usePageTitle } from "@/lib/use-page-title";
import { media } from "@/lib/media";

export default function FaqPage() {
  usePageTitle("FAQ", "Answers to common questions about Kasepu Kalisi gatherings.");
  const { data: items, isLoading, isError } = useFaqItems();

  return (
    <>
      <PageHero eyebrow="Help Center" image={media.cocktailPour} title="Questions, answered." />
      <Section>
        <div className="mx-auto max-w-2xl">
          {isLoading && <LoadingState label="Loading FAQ…" />}
          {isError && <ErrorState message="Couldn't load FAQ." />}
          {items && items.length === 0 && <EmptyState message="FAQ content is coming soon." />}
          {items && items.length > 0 && <Accordion items={items} />}

          <div className="mt-14 rounded-2xl border border-slate/15 bg-white p-8 text-center">
            <h2 className="text-2xl text-teal">Still need a hand?</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate">
              If your question isn&apos;t here, send us a message — a real person reads every one, usually the same day.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Button href="/contact">Contact us →</Button>
              <Button href="/events" variant="outline">
                Browse gatherings
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
