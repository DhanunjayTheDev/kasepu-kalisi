import { LegalLayout } from "@/components/legal-layout";
import { usePageTitle } from "@/lib/use-page-title";

export default function RefundPolicyPage() {
  usePageTitle("Refund Policy");

  return (
    <LegalLayout title="Refund Policy" updated="8 August 2026">
      <p>
        Each gathering has its own cancellation window, shown at checkout
        before you pay. The general framework is below.
      </p>

      <h2>Attendee-initiated cancellation</h2>
      <ul>
        <li>More than 7 days before the event — full refund minus a small processing fee</li>
        <li>3–7 days before the event — 50% refund</li>
        <li>Less than 3 days before the event — non-refundable</li>
      </ul>

      <h2>Event postponed or cancelled by us</h2>
      <p>
        If Kasepu Kalisi postpones or cancels a gathering, you may choose a
        full refund or transfer your ticket to the rescheduled date, free of
        charge.
      </p>

      <h2>Processing time</h2>
      <p>
        Approved refunds are issued to your original payment method within
        7–10 business days.
      </p>

      <h2>Non-refundable tickets</h2>
      <p>
        Some ticket types (marked clearly at checkout) are non-refundable
        regardless of timing, typically discounted early-bird or
        complimentary tickets.
      </p>
    </LegalLayout>
  );
}
