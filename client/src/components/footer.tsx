import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { Logo } from "@/components/logo";
import { InstagramGlyph } from "@/components/instagram-glyph";
import { useCmsContent } from "@/lib/queries";

interface ContactContent {
  supportEmail: string;
  supportPhone: string;
  instagramUrl?: string;
}

const FOOTER_COLUMNS = [
  {
    heading: "Explore",
    links: [
      { label: "Events", href: "/events" },
      { label: "About", href: "/about" },
      { label: "Gallery", href: "/gallery" },
      { label: "Venue", href: "/venue" },
    ],
  },
  {
    heading: "For Guests",
    links: [
      { label: "Your Tickets", href: "/tickets" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

const LEGAL_LINKS = [
  { label: "Privacy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms" },
  { label: "Refunds", href: "/refund-policy" },
  { label: "Ticket Policy", href: "/ticket-policy" },
];

export function Footer() {
  const { data: content } = useCmsContent<ContactContent>("contact");
  const email = content?.supportEmail ?? "hello@kasepukalisi.com";
  const instagramUrl = content?.instagramUrl ?? "https://instagram.com";

  return (
    <footer className="bg-teal text-ivory">
      <div className="container-kk py-12 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 sm:gap-12 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Logo mono className="h-12 sm:h-14" />
            <p className="mt-4 font-display italic text-ivory/80">
              Come, sit with us.
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ivory/70">
              Curated Indian gatherings built around dinner, live music and
              the conversations that make an evening worth remembering.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a
                href={`mailto:${email}`}
                aria-label="Email Kasepu Kalisi"
                className="tap-target flex items-center justify-center rounded-full border border-ivory/20 text-ivory transition-colors hover:bg-ivory/10"
              >
                <Mail size={18} />
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Kasepu Kalisi on Instagram"
                className="tap-target flex items-center justify-center rounded-full border border-ivory/20 text-ivory transition-colors hover:bg-ivory/10"
              >
                <InstagramGlyph />
              </a>
            </div>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <p className="eyebrow text-gold">{column.heading}</p>
              <ul className="mt-4 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-ivory/75 transition-colors hover:text-ivory"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-ivory/15 pt-8 sm:mt-14 sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className="text-xs text-ivory/60 transition-colors hover:text-ivory"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-xs text-ivory/50">
            © {new Date().getFullYear()} Kasepu Kalisi. All rights reserved.
          </p>
        </div>
      </div>

      {/* Oversized closing wordmark. Sits outside container-kk so it spans ~90%
          of the viewport rather than 90% of the (max-w-7xl) content column. */}
      <div className="overflow-hidden pb-8 sm:pb-12">
        <Logo mono className="mx-auto h-auto w-[90%]" />
      </div>
    </footer>
  );
}
