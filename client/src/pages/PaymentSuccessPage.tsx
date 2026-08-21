import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/button";
import { Section } from "@/components/section";
import { usePageTitle } from "@/lib/use-page-title";

export default function PaymentSuccessPage() {
  usePageTitle("Booking Confirmed");

  return (
    <Section>
      <div className="mx-auto max-w-md text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal/10 text-teal">
          <CheckCircle2 size={32} strokeWidth={1.75} />
        </span>
        <h1 className="mt-6 text-4xl">Booking confirmed.</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate">
          Your ticket is on its way to your inbox, along with a QR code you&apos;ll
          need at the door. You can also find it anytime under Your Tickets.
        </p>
        <p className="mt-4 font-sans text-sm font-semibold text-teal">
          Booking ID — KK-2026-000184
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button href="/tickets" variant="primary">
            View Your Tickets
          </Button>
          <Button href="/" variant="ghost">
            Back Home
          </Button>
        </div>
      </div>
    </Section>
  );
}
