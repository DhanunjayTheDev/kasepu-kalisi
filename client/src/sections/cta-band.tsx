import { motion } from "framer-motion";
import { Button } from "@/components/button";
import { Logo } from "@/components/logo";
import { useCmsContent, useEvents } from "@/lib/queries";
import { media } from "@/lib/media";

interface HomepageContent {
  ctaHeading?: string;
  ctaBody?: string;
  ctaPrimaryLabel?: string;
  ctaSecondaryLabel?: string;
}

export function CtaBand() {
  const { data: content } = useCmsContent<HomepageContent>("homepage");
  const { data: events } = useEvents();
  const featured = events?.find((e) => e.featured) ?? events?.[0];

  const heading = content?.ctaHeading ?? "There's a seat with your name on it.";
  const body =
    content?.ctaBody ??
    "Gatherings are intentionally small, and they fill quickly. Reserve now, or join the waitlist and we'll tell you the moment a seat opens.";
  const primaryLabel = content?.ctaPrimaryLabel ?? "Reserve a Seat";
  const secondaryLabel = content?.ctaSecondaryLabel ?? "Read the FAQ";

  return (
    <section className="pb-14 sm:pb-20 lg:pb-28">
      <div className="container-kk">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative isolate overflow-hidden rounded-3xl px-6 py-12 text-center sm:px-14 sm:py-20"
        >
          <img
            src={media.tableWithFlowers}
            alt=""
            loading="lazy"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div aria-hidden className="absolute inset-0 -z-10 bg-terracotta/88" />

          <svg
            aria-hidden
            viewBox="0 0 300 300"
            className="pointer-events-none absolute -left-20 -bottom-24 -z-10 h-80 w-80 text-ivory/15"
            fill="none"
          >
            <circle cx="150" cy="150" r="140" stroke="currentColor" strokeWidth="1" />
            <circle cx="150" cy="150" r="100" stroke="currentColor" strokeWidth="1" />
          </svg>

          <div className="flex justify-center">
            <Logo mono className="h-11 xs:h-14 sm:h-16" />
          </div>

          <h2 className="mx-auto mt-7 max-w-2xl text-[2rem] leading-tight text-ivory xs:text-4xl sm:mt-8 sm:text-5xl">{heading}</h2>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ivory/85">{body}</p>

          <div className="mt-8 flex flex-col items-stretch gap-3 xs:flex-row xs:flex-wrap xs:justify-center xs:gap-4 sm:mt-9">
            <Button
              href={featured ? `/events/${featured.slug}` : "/events"}
              variant="outline"
              className="border-ivory bg-ivory text-terracotta hover:bg-ivory/90 hover:text-terracotta"
            >
              {primaryLabel} →
            </Button>
            <Button
              href="/faq"
              variant="outline"
              className="border-ivory/60 text-ivory hover:bg-ivory hover:text-terracotta"
            >
              {secondaryLabel}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
