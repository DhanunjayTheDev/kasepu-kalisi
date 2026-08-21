import type { ReactNode } from "react";
import { Logo } from "@/components/logo";

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  /** Background photo. Every inner page carries one so the site never opens on bare type. */
  image: string;
}

/**
 * The photographic banner used at the top of every inner page — same treatment
 * as the homepage hero and Contact page: full-bleed photo, solid teal overlay
 * (no gradients, per brand rules), mono logo, gold-ruled eyebrow.
 */
export function PageHero({ eyebrow, title, description, image }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden">
      <img src={image} alt="" loading="eager" className="absolute inset-0 -z-20 h-full w-full object-cover" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-teal/85" />

      <svg
        aria-hidden
        viewBox="0 0 400 400"
        className="pointer-events-none absolute -right-24 -top-28 -z-10 h-80 w-80 text-gold/20 sm:h-96 sm:w-96"
        fill="none"
      >
        <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="1" />
        <circle cx="200" cy="200" r="130" stroke="currentColor" strokeWidth="1" />
      </svg>

      <div className="container-kk py-14 text-center sm:py-20 lg:py-24">
        <div className="flex justify-center">
          <Logo mono className="h-12 sm:h-16" />
        </div>

        <span className="eyebrow mt-7 flex items-center justify-center gap-2.5 text-gold sm:gap-3">
          <span className="h-px w-8 bg-gold" aria-hidden />
          {eyebrow}
          <span className="h-px w-8 bg-gold" aria-hidden />
        </span>

        <h1 className="mx-auto mt-5 max-w-2xl text-[2.1rem] leading-tight text-ivory xs:text-4xl sm:text-5xl lg:text-6xl">
          {title}
        </h1>

        {description && (
          <p className="mx-auto mt-5 max-w-xl text-[0.95rem] leading-relaxed text-ivory/80 sm:text-lg">{description}</p>
        )}
      </div>
    </section>
  );
}
