import { LegalLayout } from "@/components/legal-layout";
import { usePageTitle } from "@/lib/use-page-title";

export default function PrivacyPolicyPage() {
  usePageTitle("Privacy Policy");

  return (
    <LegalLayout title="Privacy Policy" updated="8 August 2026">
      <p>
        Kasepu Kalisi (&quot;we&quot;, &quot;us&quot;) collects only the
        information needed to register you for a gathering, deliver your
        ticket, and keep the event safe and running smoothly.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>Name, mobile number, email and city at registration</li>
        <li>Attendee details for each ticket in a booking</li>
        <li>Dietary preferences and special requirements, if provided</li>
        <li>Payment metadata from our payment processor (never full card details)</li>
        <li>Check-in timestamps at the venue</li>
      </ul>

      <h2>How we use it</h2>
      <p>
        Your information is used to confirm bookings, issue tickets, verify
        entry at the venue, send event updates, and improve future
        gatherings. We do not sell your data to third parties.
      </p>

      <h2>Photography &amp; video</h2>
      <p>
        Where you&apos;ve given consent during registration, photos and video
        from the gathering may be used in Kasepu Kalisi&apos;s archive and
        promotional materials.
      </p>

      <h2>Your rights</h2>
      <p>
        You can request a copy of your data, ask us to correct it, or request
        deletion of your account by contacting us through the Contact page.
      </p>
    </LegalLayout>
  );
}
