import { motion } from "framer-motion";
import { CalendarCheck, CreditCard, QrCode, PartyPopper } from "lucide-react";
import { useCmsContent } from "@/lib/queries";

interface HomepageContent {
  steps?: { title: string; body: string }[];
}

const FALLBACK = [
  { title: "Choose your gathering", body: "Browse upcoming evenings, read the menu and the line-up, and pick the night that fits." },
  { title: "Reserve your seat", body: "Select a ticket type, add your guests, and pay securely. Seats are held while you check out." },
  { title: "Get your digital ticket", body: "A QR ticket lands in your inbox and WhatsApp instantly, and lives in your account until the night." },
  { title: "Arrive and settle in", body: "Scan once at the gate and you're in. Everything after that is dinner, music and good company." },
];

const ICONS = [CalendarCheck, CreditCard, QrCode, PartyPopper];

export function HowItWorks() {
  const { data: content } = useCmsContent<HomepageContent>("homepage");
  const steps = content?.steps?.length ? content.steps : FALLBACK;

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
          <span className="eyebrow text-gold">How It Works</span>
          <h2 className="mt-4 text-[2rem] leading-tight xs:text-4xl sm:text-5xl">
            From curious
            <br />
            <span className="italic">to seated.</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate">
            Four steps, no phone calls, no waiting on a confirmation email that never comes.
          </p>
        </motion.div>

        <ol className="mt-10 grid gap-8 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = ICONS[index % ICONS.length];
            return (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-70px" }}
                transition={{ duration: 0.55, delay: index * 0.1, ease: "easeOut" }}
                className="relative border-t border-teal/15 pt-6"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-teal/8 text-teal">
                  <Icon size={21} strokeWidth={1.6} />
                </span>
                <span className="eyebrow mt-5 block text-terracotta">Step {index + 1}</span>
                <h3 className="mt-2 text-xl leading-snug text-teal">{step.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate">{step.body}</p>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
