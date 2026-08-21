import { motion } from "framer-motion";
import { useCmsContent } from "@/lib/queries";

interface HomepageContent {
  stats?: { value: string; label: string }[];
}

const FALLBACK = [
  { value: "12", label: "Gatherings hosted" },
  { value: "1,800+", label: "Seats shared" },
  { value: "6", label: "Cities" },
  { value: "4.9", label: "Average guest rating" },
];

export function StatsStrip() {
  const { data: content } = useCmsContent<HomepageContent>("homepage");
  const stats = content?.stats?.length ? content.stats : FALLBACK;

  return (
    <section className="bg-teal">
      <div className="container-kk grid grid-cols-2 gap-8 py-10 sm:gap-10 sm:py-14 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
            className="text-center sm:text-left"
          >
            <p className="font-display text-3xl leading-none text-gold xs:text-4xl sm:text-5xl">{stat.value}</p>
            <p className="mt-2.5 font-sans text-sm text-ivory/70">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
