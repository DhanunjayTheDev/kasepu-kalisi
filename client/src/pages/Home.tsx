import { Hero } from "@/sections/hero";
import { ValueStrip } from "@/sections/value-strip";
import { UpcomingGatherings } from "@/sections/upcoming-gatherings";
import { StatsStrip } from "@/sections/stats-strip";
import { Experience } from "@/sections/experience";
import { HowItWorks } from "@/sections/how-it-works";
import { BrandStory } from "@/sections/brand-story";
import { Testimonials } from "@/sections/testimonials";
import { FaqPreview } from "@/sections/faq-preview";
import { CtaBand } from "@/sections/cta-band";

export default function Home() {
  return (
    <>
      <Hero />
      <ValueStrip />
      <UpcomingGatherings />
      <StatsStrip />
      <Experience />
      <HowItWorks />
      <BrandStory />
      <Testimonials />
      <FaqPreview />
      <CtaBand />
    </>
  );
}
