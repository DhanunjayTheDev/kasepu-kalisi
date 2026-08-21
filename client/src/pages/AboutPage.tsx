import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/section";
import { usePageTitle } from "@/lib/use-page-title";
import { useCmsContent } from "@/lib/queries";
import { media } from "@/lib/media";

interface AboutContent {
  heading: string;
  beliefStatement: string;
}

const PILLARS = [
  {
    title: "Dinner",
    body: "A specially curated meal created for the gathering, never an afterthought.",
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
    body: "Indian traditions, told through a contemporary evening.",
    image: media.buffetSpread,
  },
];

export default function AboutPage() {
  usePageTitle("About", "The story and belief behind Kasepu Kalisi.");
  const { data: content } = useCmsContent<AboutContent>("about");

  const heading = content?.heading ?? "Not an event. An encounter.";
  const sentences = heading.split(". ").map((s) => s.replace(/\.$/, ""));
  const [headingFirst, ...headingRest] = sentences;
  const belief =
    content?.beliefStatement ??
    "We believe the best nights are the ones that don't need to be documented. A song you didn't know you needed. A dish that tastes like someone's childhood. A stranger who becomes a friend by dessert. Everything we build — the seating, the menu, the music — exists to make room for that.";

  return (
    <>
      <PageHero
        eyebrow="Our Story"
        image={media.outdoorGathering}
        title={
          <>
            {headingFirst}.
            {headingRest.length > 0 && (
              <>
                <br />
                <span className="italic text-gold">{headingRest.join(". ")}.</span>
              </>
            )}
          </>
        }
        description="Kasepu Kalisi began with a simple frustration: most gatherings feel like logistics. We wanted evenings that felt like something worth remembering."
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
          <div className="overflow-hidden rounded-3xl">
            <img src={media.tableWithFlowers} alt="" className="aspect-[4/3] w-full object-cover" loading="lazy" />
          </div>
          <div>
            <h2 className="text-3xl">What we believe</h2>
            <p className="mt-4 text-base leading-relaxed text-slate">{belief}</p>
          </div>
        </div>

        <div className="mt-12 grid gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((pillar) => (
            <div key={pillar.title} className="overflow-hidden rounded-2xl border border-slate/10">
              <img src={pillar.image} alt="" className="aspect-[4/3] w-full object-cover" loading="lazy" />
              <div className="p-5">
                <h3 className="text-xl">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{pillar.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
