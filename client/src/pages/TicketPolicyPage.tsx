import { LegalLayout } from "@/components/legal-layout";
import { usePageTitle } from "@/lib/use-page-title";

export default function TicketPolicyPage() {
  usePageTitle("Ticket Policy");

  return (
    <LegalLayout title="Ticket Policy" updated="8 August 2026">
      <h2>Entry</h2>
      <p>
        Bring your digital ticket (QR code) on your phone, or a printed copy.
        The name on the ticket should match a valid photo ID for entry.
      </p>

      <h2>One scan, one entry</h2>
      <p>
        Unless an event explicitly allows re-entry, each QR code is valid for
        a single scan. A ticket already used at the gate cannot be reused.
      </p>

      <h2>Transfers</h2>
      <p>
        Where enabled, you can transfer a ticket to another attendee from
        Your Tickets before the event&apos;s transfer deadline. The new
        attendee&apos;s details replace yours on the ticket record.
      </p>

      <h2>Age &amp; dietary requirements</h2>
      <p>
        Some gatherings have a minimum age requirement, shown on the event
        page. Dietary preferences submitted at registration are shared with
        our catering team but can&apos;t always guarantee zero cross-contact
        with allergens.
      </p>

      <h2>Lost tickets</h2>
      <p>
        Tickets are never truly &quot;lost&quot; — they live under Your
        Tickets on this site and are re-sent by email on request via
        Contact.
      </p>
    </LegalLayout>
  );
}
