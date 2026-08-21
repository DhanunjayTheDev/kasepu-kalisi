import { LegalLayout } from "@/components/legal-layout";
import { usePageTitle } from "@/lib/use-page-title";

export default function TermsPage() {
  usePageTitle("Terms & Conditions");

  return (
    <LegalLayout title="Terms &amp; Conditions" updated="8 August 2026">
      <p>
        By registering for a Kasepu Kalisi gathering, you agree to the terms
        below. Please read them alongside our Ticket Policy and Refund
        Policy.
      </p>

      <h2>Tickets</h2>
      <p>
        Tickets are issued to the named attendee and are non-transferable
        unless transfer is explicitly enabled for that event. Each ticket
        admits one person and is valid for a single entry unless stated
        otherwise.
      </p>

      <h2>Conduct at the venue</h2>
      <ul>
        <li>Follow venue staff and safety instructions at all times</li>
        <li>Respect fellow attendees, performers and venue property</li>
        <li>Kasepu Kalisi may refuse or remove entry for disruptive behaviour</li>
      </ul>

      <h2>Changes to an event</h2>
      <p>
        Occasionally a gathering may be postponed, rescheduled or cancelled.
        Registered attendees will be notified by email and/or WhatsApp, and
        the applicable refund policy will apply.
      </p>

      <h2>Liability</h2>
      <p>
        Kasepu Kalisi is not liable for personal loss or injury at a venue
        beyond what is required by applicable law. Please take care of your
        belongings.
      </p>
    </LegalLayout>
  );
}
