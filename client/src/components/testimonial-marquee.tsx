import { Quote, Star } from "lucide-react";
import { ThreeDScrollTriggerContainer, ThreeDScrollTriggerRow } from "@/components/scroll-trigger-row";
import type { TestimonialItem } from "@/types/api";

function TestimonialCard({ item }: { item: TestimonialItem }) {
  return (
    <figure className="mr-5 flex w-[19rem] shrink-0 flex-col whitespace-normal rounded-2xl border border-ivory/15 bg-ivory/8 p-6 backdrop-blur-sm sm:w-[23rem] sm:p-7">
      <Quote size={24} className="shrink-0 text-gold" aria-hidden />

      <blockquote className="mt-4 line-clamp-5 flex-1 font-display text-base italic leading-relaxed text-ivory/90 sm:text-lg">
        “{item.quote}”
      </blockquote>

      <figcaption className="mt-6 flex items-end justify-between gap-4 border-t border-ivory/15 pt-4">
        <div className="min-w-0">
          <p className="truncate font-sans text-sm font-semibold text-ivory">{item.name}</p>
          <p className="mt-0.5 truncate font-sans text-xs text-ivory/60">
            {[item.role, item.city].filter(Boolean).join(" · ")}
          </p>
        </div>
        <div className="flex shrink-0 gap-0.5" aria-label={`${item.rating} out of 5`}>
          {Array.from({ length: item.rating }).map((_, i) => (
            <Star key={i} size={12} className="text-gold" fill="currentColor" aria-hidden />
          ))}
        </div>
      </figcaption>
    </figure>
  );
}

const EDGE_FADE = "[mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]";

interface TestimonialMarqueeProps {
  items: TestimonialItem[];
}

/**
 * Two rows of testimonials, each auto-scrolling in an opposite direction via
 * Lightswind's ThreeDScrollTrigger — both rows share one page-scroll-velocity
 * reading, so scrolling up speeds them toward the right and scrolling down
 * speeds them toward the left, settling back to their own idle direction
 * once scrolling stops.
 */
export function TestimonialMarquee({ items }: TestimonialMarqueeProps) {
  const mid = Math.ceil(items.length / 2);
  const rowA = items.slice(0, mid);
  const rowB = items.slice(mid).length >= 3 ? items.slice(mid) : items;

  return (
    <ThreeDScrollTriggerContainer className="mt-12 flex flex-col gap-5">
      <ThreeDScrollTriggerRow baseVelocity={4} direction={1} className={EDGE_FADE}>
        {rowA.map((item) => (
          <TestimonialCard key={item._id} item={item} />
        ))}
      </ThreeDScrollTriggerRow>

      <ThreeDScrollTriggerRow baseVelocity={4} direction={-1} className={EDGE_FADE}>
        {rowB.map((item) => (
          <TestimonialCard key={item._id} item={item} />
        ))}
      </ThreeDScrollTriggerRow>
    </ThreeDScrollTriggerContainer>
  );
}
