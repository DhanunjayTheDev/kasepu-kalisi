import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { Section } from "@/components/section";
import { ContactForm } from "@/components/contact-form";
import { Logo } from "@/components/logo";
import { InstagramGlyph } from "@/components/instagram-glyph";
import { usePageTitle } from "@/lib/use-page-title";
import { useCmsContent, useEvents } from "@/lib/queries";
import { media } from "@/lib/media";

interface ContactContent {
  supportEmail: string;
  supportPhone: string;
  instagramUrl?: string;
}

export default function ContactPage() {
  usePageTitle("Contact", "Get in touch with the Kasepu Kalisi team.");
  const { data: content } = useCmsContent<ContactContent>("contact");
  const { data: events } = useEvents();

  const email = content?.supportEmail ?? "hello@kasepukalisi.com";
  const phone = content?.supportPhone ?? "+91 98765 43210";
  const instagram = content?.instagramUrl ?? "https://instagram.com/kasepukalisi";
  const venue = events?.[0]?.venue;

  return (
    <>
      {/* Editorial banner — the old page opened straight onto a bare form. */}
      <section className="relative isolate overflow-hidden">
        <img
          src={media.loungeInterior}
          alt=""
          loading="eager"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
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
            Say Hello
            <span className="h-px w-8 bg-gold" aria-hidden />
          </span>

          <h1 className="mx-auto mt-5 max-w-2xl text-[2.1rem] leading-tight text-ivory xs:text-4xl sm:text-5xl lg:text-6xl">
            We&apos;d love to <span className="italic text-gold">hear from you.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-[0.95rem] leading-relaxed text-ivory/80 sm:text-lg">
            Questions about a gathering, a booking, dietary needs or bringing Kasepu Kalisi to your city — a real person
            reads every message.
          </p>
        </div>
      </section>

      {/* Quick contact cards, lifted so they straddle the banner edge. Needs its own
          positioning: the banner above is positioned, so a static row paints beneath it. */}
      <div className="container-kk relative z-10 -mt-10 sm:-mt-12">
        <div className="grid gap-4 sm:grid-cols-3">
          <a
            href={`mailto:${email}`}
            className="group flex flex-col rounded-2xl border border-slate/15 bg-white p-6 transition-shadow duration-300 hover:shadow-[0_2px_24px_rgba(30,108,113,0.10)]"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-teal/8 text-teal transition-colors group-hover:bg-terracotta/10 group-hover:text-terracotta">
              <Mail size={18} strokeWidth={1.7} />
            </span>
            <p className="mt-4 font-sans text-sm font-semibold text-teal">Email us</p>
            <p className="mt-1 break-words text-sm text-slate">{email}</p>
          </a>

          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="group flex flex-col rounded-2xl border border-slate/15 bg-white p-6 transition-shadow duration-300 hover:shadow-[0_2px_24px_rgba(30,108,113,0.10)]"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-teal/8 text-teal transition-colors group-hover:bg-terracotta/10 group-hover:text-terracotta">
              <Phone size={18} strokeWidth={1.7} />
            </span>
            <p className="mt-4 font-sans text-sm font-semibold text-teal">Call us</p>
            <p className="mt-1 text-sm text-slate">{phone}</p>
          </a>

          <a
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col rounded-2xl border border-slate/15 bg-white p-6 transition-shadow duration-300 hover:shadow-[0_2px_24px_rgba(30,108,113,0.10)]"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-teal/8 text-teal transition-colors group-hover:bg-terracotta/10 group-hover:text-terracotta">
              <InstagramGlyph />
            </span>
            <p className="mt-4 font-sans text-sm font-semibold text-teal">Instagram</p>
            <p className="mt-1 text-sm text-slate">@kasepukalisi</p>
          </a>
        </div>
      </div>

      <Section>
        <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-slate/15 bg-white p-6 sm:p-9">
              <span className="eyebrow text-gold">Send a Message</span>
              <h2 className="mt-3 text-2xl leading-tight sm:text-3xl">Tell us what you need.</h2>
              <p className="mt-2.5 text-sm leading-relaxed text-slate">
                We reply within one business day, usually much sooner.
              </p>

              <div className="mt-7">
                <ContactForm />
              </div>
            </div>
          </div>

          <aside className="flex flex-col gap-4 lg:col-span-2">
            <div className="rounded-2xl border border-slate/15 bg-white p-6 sm:p-7">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/15 text-gold">
                <Clock size={18} strokeWidth={1.7} />
              </span>
              <h3 className="mt-4 text-xl text-teal">When we reply</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate">
                Monday to Saturday, 10am – 7pm IST. Messages sent on a gathering night are answered the following
                morning.
              </p>
            </div>

            {venue && (
              <div className="rounded-2xl border border-slate/15 bg-white p-6 sm:p-7">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-teal/8 text-teal">
                  <MapPin size={18} strokeWidth={1.7} />
                </span>
                <h3 className="mt-4 text-xl text-teal">Where we gather next</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">
                  {venue.name}
                  <br />
                  {venue.address}
                </p>
                <Link
                  to="/venue"
                  className="mt-4 inline-block font-sans text-sm font-semibold text-terracotta underline-offset-4 hover:underline"
                >
                  Venue details →
                </Link>
              </div>
            )}

            <div className="rounded-2xl bg-teal p-6 sm:p-7">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ivory/10 text-gold">
                <MessageCircle size={18} strokeWidth={1.7} />
              </span>
              <h3 className="mt-4 text-xl text-ivory">Already booked?</h3>
              <p className="mt-2 text-sm leading-relaxed text-ivory/75">
                Most booking questions — tickets, transfers, refunds — are answered in the Help Center.
              </p>
              <Link
                to="/faq"
                className="mt-4 inline-block font-sans text-sm font-semibold text-gold underline-offset-4 hover:underline"
              >
                Read the FAQ →
              </Link>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
