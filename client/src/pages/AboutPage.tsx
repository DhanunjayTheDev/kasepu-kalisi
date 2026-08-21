import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Button } from "@/components/button";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import { usePageTitle } from "@/lib/use-page-title";
import { useCmsContent, useEvents } from "@/lib/queries";
import { formatDate } from "@/lib/format";
import { media } from "@/lib/media";

interface AboutContent {
  heading: string;
  beliefStatement: string;
}

const PILLARS = [
  {
    title: "Dinner",
    body: "A specially curated meal created for the gathering, never an afterthought. The menu is written for the room, then cooked the same day.",
    image: media.dinnerPlate,
  },
  {
    title: "Live Music",
    body: "Performances chosen to sit with the mood of the room, not distract from it. Loud enough to move you, quiet enough to talk over.",
    image: media.concertCrowd,
  },
  {
    title: "Meet & Connect",
    body: "Seating and pacing designed so strangers actually get to talk. Nobody is left standing at the edge holding a drink.",
    image: media.wineToast,
  },
  {
    title: "Cultural Experience",
    body: "Indian traditions, told through a contemporary evening. Familiar enough to feel like home, new enough to feel like a discovery.",
    image: media.buffetSpread,
  },
];

export default function AboutPage() {
  usePageTitle("About", "The story and belief behind Kasepu Kalisi.");
  const { data: content } = useCmsContent<AboutContent>("about");
  const { data: events } = useEvents();

  const heading = content?.heading ?? "Not an event. An encounter.";
  const sentences = heading.split(". ").map((s) => s.replace(/\.$/, ""));
  const [headingFirst, ...headingRest] = sentences;
  const belief =
    content?.beliefStatement ??
    "We believe the best nights are the ones that don't need to be documented. A song you didn't know you needed. A dish that tastes like someone's childhood. A stranger who becomes a friend by dessert. Everything we build — the seating, the menu, the music — exists to make room for that.";

  // Oldest first: the story reads forward in time.
  const timeline = [...(events ?? [])].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <>
      {/* Statement opener — the wordmark, then the belief, set large. */}
      <section className="relative isolate overflow-hidden bg-teal">
        <img
          src={media.outdoorGathering}
          alt=""
          loading="eager"
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-25"
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-teal/80" />

        <div className="container-kk relative py-20 text-center sm:py-28 lg:py-36">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex justify-center">
              <Logo mono className="h-14 sm:h-20" />
            </div>

            <span className="eyebrow mt-8 flex items-center justify-center gap-3 text-gold">
              <span className="rule-gold" aria-hidden />
              Our Story
              <span className="rule-gold" aria-hidden />
            </span>

            <h1 className="mx-auto mt-6 max-w-4xl text-[2.4rem] leading-[1.05] text-ivory xs:text-5xl sm:text-6xl lg:text-7xl">
              {headingFirst}.
              {headingRest.length > 0 && (
                <>
                  <br />
                  <span className="italic text-gold">{headingRest.join(". ")}.</span>
                </>
              )}
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-[0.95rem] leading-relaxed text-ivory/80 sm:text-lg">
              Kasepu Kalisi began with a simple frustration: most gatherings feel like logistics. We wanted evenings
              that felt like something worth remembering.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Belief — a centred statement. A short CMS quote beside a portrait left a
          large void, so the words lead and the imagery sits under them as a band. */}
      <section className="py-14 sm:py-20 lg:py-28">
        <div className="container-kk">
          <motion.figure
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <Quote size={32} className="mx-auto text-gold" aria-hidden />
            <blockquote className="mt-7 font-display text-2xl italic leading-[1.35] text-teal sm:text-[2rem] lg:text-[2.6rem]">
              {belief}
            </blockquote>
            <figcaption className="mt-8">
              <span className="mx-auto block h-px w-16 bg-terracotta" aria-hidden />
              <span className="mt-4 block font-sans text-sm text-slate">The Kasepu Kalisi team</span>
            </figcaption>
          </motion.figure>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:mt-16 sm:gap-6 lg:grid-cols-4">
            {[media.tableWithFlowers, media.outdoorGathering, media.wineToast, media.dinnerPlate].map(
              (src, index) => (
                <motion.div
                  key={src}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-70px" }}
                  transition={{ duration: 0.6, delay: index * 0.07, ease: "easeOut" }}
                  className={cn(
                    "group overflow-hidden rounded-2xl",
                    // Staggered heights stop the row reading as four identical boxes.
                    index % 2 === 0 ? "lg:mt-8" : ""
                  )}
                >
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </motion.div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Four pillars, numbered like chapters. */}
      <section className="border-y border-slate/10 bg-white py-14 sm:py-20 lg:py-24">
        <div className="container-kk">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-lg"
          >
            <span className="eyebrow text-gold">What Makes The Night</span>
            <h2 className="mt-4 text-[2rem] leading-tight xs:text-4xl sm:text-5xl">
              Four things,
              <br />
              <span className="italic text-terracotta">in equal measure.</span>
            </h2>
          </motion.div>

          <div className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {PILLARS.map((pillar, index) => (
              <motion.article
                key={pillar.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-70px" }}
                transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
                className="group overflow-hidden rounded-2xl border border-slate/12 bg-ivory"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={pillar.image}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-xl text-teal">{pillar.title}</h3>
                    <span className="numeral text-3xl">0{index + 1}</span>
                  </div>
                  <span className="mt-3 block h-px w-8 bg-gold" aria-hidden />
                  <p className="mt-3 text-sm leading-relaxed text-slate">{pillar.body}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Where we've been — real events, oldest to newest. */}
      {timeline.length > 0 && (
        <section className="py-14 sm:py-20 lg:py-28">
          <div className="container-kk">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-lg"
            >
              <span className="eyebrow text-gold">Where We&apos;ve Gathered</span>
              <h2 className="mt-4 text-[2rem] leading-tight xs:text-4xl sm:text-5xl">
                One table,
                <br />
                <span className="italic">many cities.</span>
              </h2>
            </motion.div>

            <ol className="mt-10 sm:mt-14">
              {timeline.map((event, index) => {
                const isLast = index === timeline.length - 1;
                return (
                  <motion.li
                    key={event._id}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5, delay: index * 0.07, ease: "easeOut" }}
                    className="group grid grid-cols-[1.25rem_1fr] gap-x-4 sm:grid-cols-[1.5rem_1fr] sm:gap-x-6"
                  >
                    <div className="flex flex-col items-center">
                      <span
                        aria-hidden
                        className="mt-2 h-3 w-3 shrink-0 rounded-full bg-terracotta ring-4 ring-terracotta/12 transition-transform duration-300 group-hover:scale-125"
                      />
                      {!isLast && <span aria-hidden className="mt-2 w-px flex-1 bg-slate/25" />}
                    </div>

                    <div className={isLast ? "" : "pb-9"}>
                      <span className="eyebrow text-gold">{formatDate(event.date)}</span>
                      <p className="mt-1.5 font-display text-2xl leading-snug text-teal transition-colors duration-300 group-hover:text-terracotta sm:text-3xl">
                        {event.title}
                      </p>
                      <p className="mt-1.5 text-sm text-slate">
                        {event.venue.name}, {event.city}
                      </p>
                      {event.tagline && (
                        <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate/85">{event.tagline}</p>
                      )}
                    </div>
                  </motion.li>
                );
              })}
            </ol>
          </div>
        </section>
      )}

      {/* Closing invitation. */}
      <section className="pb-14 sm:pb-20 lg:pb-28">
        <div className="container-kk">
          <div className="relative isolate overflow-hidden rounded-3xl bg-terracotta px-6 py-14 text-center sm:px-14 sm:py-20">
            <svg
              aria-hidden
              viewBox="0 0 300 300"
              className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 text-ivory/15"
              fill="none"
            >
              <circle cx="150" cy="150" r="140" stroke="currentColor" strokeWidth="1" />
              <circle cx="150" cy="150" r="100" stroke="currentColor" strokeWidth="1" />
            </svg>

            <h2 className="mx-auto max-w-2xl text-[2rem] leading-tight text-ivory xs:text-4xl sm:text-5xl">
              The next one is
              <br />
              <span className="italic">already being planned.</span>
            </h2>
            <div className="mt-8 flex flex-col items-stretch gap-3 xs:flex-row xs:justify-center xs:gap-4">
              <Button
                href="/events"
                variant="outline"
                className="border-ivory bg-ivory text-terracotta hover:bg-ivory/90 hover:text-terracotta"
              >
                See upcoming gatherings →
              </Button>
              <Button href="/contact" variant="outline" className="border-ivory/60 text-ivory hover:bg-ivory hover:text-terracotta">
                Talk to us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
