import { XCircle } from "lucide-react";
import { Button } from "@/components/button";
import { Section } from "@/components/section";
import { usePageTitle } from "@/lib/use-page-title";

export default function PaymentFailedPage() {
  usePageTitle("Payment Failed");

  return (
    <Section>
      <div className="mx-auto max-w-md text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-terracotta/10 text-terracotta">
          <XCircle size={32} strokeWidth={1.75} />
        </span>
        <h1 className="mt-6 text-4xl">Payment didn&apos;t go through.</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate">
          Your card or bank may have declined the transaction. No amount has
          been deducted — your seats are still held for a few minutes.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button href="/checkout" variant="primary">
            Try Again
          </Button>
          <Button href="/contact" variant="ghost">
            Contact Support
          </Button>
        </div>
      </div>
    </Section>
  );
}
