import { motion } from "framer-motion";
import { Users, HeartHandshake, Sparkles } from "lucide-react";

const VALUES = [
  {
    icon: Users,
    title: "Curated, Not Crowded",
    body: "Guest lists are capped on purpose. Small enough that the room stays warm, and you can hear the person across the table.",
  },
  {
    icon: HeartHandshake,
    title: "Made With Feeling",
    body: "The menu, the seating, the order of the music — every choice is deliberate, and every one of them is made by hand.",
  },
  {
    icon: Sparkles,
    title: "Leave With New Stories",
    body: "Come alone or come with five. Either way the evening is built so that nobody spends it standing in a corner.",
  },
];

export function ValueStrip() {
  return (
    <section className="border-y border-slate/10 bg-ivory">
      <div className="container-kk py-14 sm:py-20 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="eyebrow flex items-center justify-center gap-3 text-gold">
            <span className="h-px w-8 bg-gold" aria-hidden />
            Why Kasepu Kalisi
            <span className="h-px w-8 bg-gold" aria-hidden />
          </span>
          <h2 className="mt-5 text-[2rem] leading-tight xs:text-4xl sm:text-5xl">
            An evening that earns
            <br />
            <span className="italic text-terracotta">its place in your week.</span>
          </h2>
        </motion.div>

        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-slate/12 bg-slate/12 sm:mt-16 sm:grid-cols-3">
          {VALUES.map(({ icon: Icon, title, body }, index) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              className="group flex flex-col bg-ivory p-7 transition-colors duration-300 hover:bg-white sm:p-8 lg:p-10"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-teal/8 text-teal transition-colors duration-300 group-hover:bg-terracotta/10 group-hover:text-terracotta">
                  <Icon size={21} strokeWidth={1.6} />
                </span>
                <span className="font-display text-4xl leading-none text-slate/20">0{index + 1}</span>
              </div>

              <h3 className="mt-7 text-2xl leading-snug text-teal">{title}</h3>
              <span aria-hidden className="mt-4 block h-px w-10 bg-gold" />
              <p className="mt-4 text-sm leading-relaxed text-slate">{body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
