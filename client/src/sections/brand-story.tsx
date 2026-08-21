import { motion } from "framer-motion";
import { useCmsContent } from "@/lib/queries";
import TextLoop from "@/components/text-loop";

interface AboutContent {
  heading: string;
  beliefStatement: string;
}

export function BrandStory() {
  const { data: content } = useCmsContent<AboutContent>("about");
  const heading = content?.heading ?? "Not an event. An encounter.";
  const sentences = heading.split(". ").map((s) => s.replace(/\.$/, ""));
  const [headingFirst, ...headingRest] = sentences;
  const belief =
    content?.beliefStatement ??
    "We believe the best nights are the ones that don't need to be documented. A song you didn't know you needed. A dish that tastes like someone's childhood. A stranger who becomes a friend by dessert.";

  return (
    <section className="relative isolate overflow-hidden bg-terracotta py-16 sm:py-24 lg:py-32">
      {/* Full-bleed decorative loop behind the copy — no ribbon band, just a
          faint typographic texture the width of the whole section. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center opacity-[0.14]">
        <TextLoop
          text="Kasepu Kalisi"
          shape="line"
          speed={55}
          separator="✦"
          fontSize={120}
          fontWeight={700}
          letterSpacing={2}
          uppercase
          color="#F7F1E9"
          ribbon={false}
          pauseOnHover={false}
          className="w-full"
        />
      </div>

      <div className="container-kk relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="eyebrow text-ivory/80">Our Belief</span>
          <h2 className="mt-5 text-[2rem] leading-tight text-ivory xs:text-4xl sm:text-5xl">
            {headingFirst}.
            {headingRest.length > 0 && (
              <>
                <br />
                <span className="italic">{headingRest.join(". ")}.</span>
              </>
            )}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[0.95rem] leading-relaxed text-ivory/85 sm:mt-6 sm:text-lg">{belief}</p>
        </motion.div>
      </div>
    </section>
  );
}
