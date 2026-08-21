import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useState } from "react";
import { media, experienceVideo } from "@/lib/media";

const EXPERIENCES = [
  {
    title: "Dinner",
    body: "A specially curated dinner created for the gathering, never an afterthought.",
    image: media.dinnerPlate,
  },
  {
    title: "Live Music",
    body: "Performances chosen to sit with the mood of the room, not distract from it.",
    image: media.concertCrowd,
  },
  {
    title: "Meet & Connect",
    body: "Seating and pacing designed so strangers actually get to talk.",
    image: media.wineToast,
  },
  {
    title: "Cultural Experience",
    body: "Celebrate Indian traditions through a contemporary evening.",
    image: media.buffetSpread,
  },
];

/**
 * A bento grid: the video is the large hero cell (2 cols × 2 rows on desktop),
 * the four experience tiles fill the remaining four 1×1 cells beside it. Below
 * lg it drops to a plain stack + 2-up grid, since a bento layout needs room to
 * read as one composition rather than a stack of squares.
 */
export function Experience() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="py-14 sm:py-20 lg:py-28">
      <div className="container-kk">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-lg"
        >
          <span className="eyebrow text-gold">The Experience</span>
          <h2 className="mt-4 text-[2rem] leading-tight xs:text-4xl sm:text-5xl">
            Four things,
            <br />
            <span className="italic">done properly.</span>
          </h2>
        </motion.div>

        <div className="mt-10 flex flex-col gap-3 sm:mt-12 sm:gap-4 lg:grid lg:h-[34rem] lg:grid-cols-4 lg:grid-rows-2 lg:gap-5">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative order-first overflow-hidden rounded-2xl bg-teal sm:rounded-3xl lg:order-none lg:col-span-2 lg:row-span-2 lg:h-full"
          >
            {playing ? (
              <video src={experienceVideo.src} controls autoPlay className="aspect-video h-full w-full object-cover lg:aspect-auto" />
            ) : (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                className="group relative block aspect-video h-full w-full lg:aspect-auto"
                aria-label="Play video: a night at Kasepu Kalisi"
              >
                <img src={experienceVideo.poster} alt="" className="h-full w-full object-cover opacity-70" />
                <div className="absolute inset-0 bg-teal/40 transition-colors group-hover:bg-teal/30" />
                <span className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ivory/95 text-terracotta shadow-lg transition-transform group-hover:scale-110 sm:h-16 sm:w-16">
                    <Play size={22} fill="currentColor" className="ml-1" />
                  </span>
                  <span className="eyebrow px-6 text-center text-ivory">Watch a night at Kasepu Kalisi</span>
                </span>
              </button>
            )}
          </motion.div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:contents">
            {EXPERIENCES.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
                className="group relative overflow-hidden rounded-2xl lg:h-full"
              >
                <div className="aspect-[3/4] w-full overflow-hidden lg:aspect-auto lg:h-full">
                  <img
                    src={item.image}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-teal/85 p-4 sm:p-5">
                  <h3 className="text-lg leading-snug text-ivory sm:text-xl">{item.title}</h3>
                  <p className="mt-1.5 hidden text-xs leading-relaxed text-ivory/75 xs:block">{item.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
