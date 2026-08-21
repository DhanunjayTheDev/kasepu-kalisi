import { motion, useReducedMotion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { useTestimonials } from "@/lib/queries";
import { media } from "@/lib/media";
import { TestimonialMarquee } from "@/components/testimonial-marquee";

export function Testimonials() {
  const { data: testimonials, isLoading } = useTestimonials();
  const prefersReducedMotion = useReducedMotion();

  // Nothing published yet — omit the section rather than showing an empty shell.
  if (!isLoading && !testimonials?.length) return null;

  return (
    <section className="relative isolate overflow-hidden py-14 sm:py-20 lg:py-28">
      <img src={media.loungeInterior} alt="" loading="lazy" className="absolute inset-0 -z-20 h-full w-full object-cover" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-teal/90" />

      <div className="container-kk">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-xl"
        >
          <span className="eyebrow text-gold">In Their Words</span>
          <h2 className="mt-4 text-[2rem] leading-tight text-ivory xs:text-4xl sm:text-5xl">
            What guests say
            <br />
            <span className="italic text-gold">on the way home.</span>
          </h2>
        </motion.div>

        {isLoading && (
          <div className="mt-12 flex flex-col gap-5">
            <div className="h-56 animate-pulse rounded-2xl bg-ivory/10" />
            <div className="h-56 animate-pulse rounded-2xl bg-ivory/10" />
          </div>
        )}

        {/* Reduced-motion users get the original static grid — a frozen marquee
            would just hide most of the testimonials behind the overflow clip. */}
        {!isLoading && testimonials && (prefersReducedMotion ? (
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {testimonials.map((item, index) => (
              <motion.figure
                key={item._id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-70px" }}
                transition={{ duration: 0.55, delay: (index % 2) * 0.1, ease: "easeOut" }}
                className="flex flex-col rounded-2xl border border-ivory/15 bg-ivory/8 p-6 backdrop-blur-sm sm:p-7"
              >
                <Quote size={26} className="shrink-0 text-gold" aria-hidden />
                <blockquote className="mt-5 flex-1 font-display text-lg italic leading-relaxed text-ivory/90 sm:text-xl">
                  “{item.quote}”
                </blockquote>
                <figcaption className="mt-7 flex items-end justify-between gap-4 border-t border-ivory/15 pt-5">
                  <div>
                    <p className="font-sans text-sm font-semibold text-ivory">{item.name}</p>
                    <p className="mt-0.5 font-sans text-xs text-ivory/60">
                      {[item.role, item.city].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-0.5" aria-label={`${item.rating} out of 5`}>
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} size={13} className="text-gold" fill="currentColor" aria-hidden />
                    ))}
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        ) : (
          <TestimonialMarquee items={testimonials} />
        ))}
      </div>
    </section>
  );
}
