import { motion, type Variants } from "framer-motion";
import { ArrowDown, CalendarDays, MapPin, Ticket } from "lucide-react";
import { Button } from "@/components/button";
import { Logo } from "@/components/logo";
import { useCmsContent, useEvents } from "@/lib/queries";
import { formatDate, formatCurrency } from "@/lib/format";
import { media } from "@/lib/media";

interface HomepageContent {
  eyebrow: string;
  heroHeading: string;
  heroDescription: string;
  primaryCtaLabel: string;
}

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: EASE_OUT },
  }),
};

export function Hero() {
  const { data: content } = useCmsContent<HomepageContent>("homepage");
  const { data: events } = useEvents();
  const featured = events?.find((e) => e.featured) ?? events?.[0];

  const eyebrow = content?.eyebrow ?? "Gatherings With a Pulse";
  const heading = content?.heroHeading ?? "Come as you are.";
  const [headingFirst, ...headingRestWords] = heading.split(" ");
  const headingRest = headingRestWords.join(" ");
  const description =
    content?.heroDescription ??
    "Kasepu Kalisi is a place for meaningful time together — dinner, live music and stories that find us around a shared table.";
  const ctaLabel = content?.primaryCtaLabel ?? "Explore Gatherings";

  return (
    <section className="relative isolate flex min-h-[calc(100svh-4rem)] flex-col justify-center overflow-hidden sm:min-h-[calc(100svh-5rem)]">
      <img
        src={media.outdoorGathering}
        alt=""
        loading="eager"
        fetchPriority="high"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      {/* Solid overlay — the brand system forbids gradients anywhere. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-teal/82" />

      <svg
        aria-hidden
        viewBox="0 0 400 400"
        className="pointer-events-none absolute -right-32 -top-28 -z-10 h-[28rem] w-[28rem] text-gold/20"
        fill="none"
      >
        <circle cx="200" cy="200" r="190" stroke="currentColor" strokeWidth="1" />
        <circle cx="200" cy="200" r="145" stroke="currentColor" strokeWidth="1" />
        <circle cx="200" cy="200" r="100" stroke="currentColor" strokeWidth="1" />
      </svg>

      <div className="container-kk relative py-14 sm:py-20 lg:py-24">
        <motion.div initial="hidden" animate="show" className="mx-auto max-w-3xl text-center">
          <motion.div variants={fadeUp} custom={0} className="flex justify-center">
            <Logo mono className="h-20 w-full max-w-2xl xs:h-24 sm:h-32 md:h-40 lg:h-48" />
          </motion.div>

          <motion.p
            variants={fadeUp}
            custom={0.12}
            className="eyebrow mt-6 flex items-center justify-center gap-2.5 text-gold sm:mt-8 sm:gap-3"
          >
            <span className="h-px w-8 bg-gold" aria-hidden />
            {eyebrow}
            <span className="h-px w-8 bg-gold" aria-hidden />
          </motion.p>

          <motion.h1
            variants={fadeUp}
            custom={0.22}
            className="mt-5 text-[2.5rem] leading-[1.05] text-ivory xs:text-5xl sm:mt-6 sm:text-6xl md:text-7xl"
          >
            {headingFirst}
            {headingRest && (
              <>
                {" "}
                <span className="italic text-gold">{headingRest}</span>
              </>
            )}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={0.32}
            className="mx-auto mt-5 max-w-xl text-[0.95rem] leading-relaxed text-ivory/80 sm:mt-7 sm:text-lg"
          >
            {description}
          </motion.p>

          <motion.div variants={fadeUp} custom={0.42} className="mt-8 flex flex-col items-stretch gap-3 xs:flex-row xs:flex-wrap xs:items-center xs:justify-center xs:gap-4 sm:mt-10">
            <Button href="/events" variant="primary">
              {ctaLabel} →
            </Button>
            <Button
              href="/about"
              variant="outline"
              className="border-ivory/60 text-ivory hover:bg-ivory hover:text-teal"
            >
              Our Story
            </Button>
          </motion.div>
        </motion.div>

        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55, ease: EASE_OUT }}
            className="mx-auto mt-10 max-w-4xl rounded-2xl border border-ivory/15 bg-ivory/10 p-5 backdrop-blur-sm sm:mt-16 sm:p-7"
          >
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-6">
              <div className="min-w-0">
                <span className="eyebrow text-gold">Next Gathering</span>
                <h2 className="mt-2 text-xl leading-tight text-ivory xs:text-2xl sm:text-3xl">{featured.title}</h2>

                <div className="mt-4 flex flex-col gap-2 font-sans text-sm text-ivory/75 xs:flex-row xs:flex-wrap xs:gap-x-6">
                  <span className="flex items-center gap-2">
                    <CalendarDays size={15} className="text-gold" />
                    {formatDate(featured.date)}
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin size={15} className="text-gold" />
                    {featured.venue.name}, {featured.city}
                  </span>
                  <span className="flex items-center gap-2">
                    <Ticket size={15} className="text-gold" />
                    From <span className="font-semibold text-ivory">{formatCurrency(featured.priceFrom)}</span>
                  </span>
                </div>
              </div>

              <Button href={`/events/${featured.slug}`} variant="primary" className="w-full shrink-0 xs:w-auto">
                Reserve a seat →
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      <motion.a
        href="#gatherings"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute inset-x-0 bottom-6 mx-auto hidden w-fit items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-ivory/60 transition-colors hover:text-ivory sm:flex"
      >
        <ArrowDown size={14} />
        Scroll
      </motion.a>
    </section>
  );
}
