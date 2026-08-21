import { Navigate } from "react-router-dom";
import { Section } from "@/components/section";
import { AuthGate } from "@/components/auth-gate";
import { usePageTitle } from "@/lib/use-page-title";

export default function TicketLookupPage() {
  usePageTitle("Your Tickets");

  return (
    <Section>
      <AuthGate>
        <Navigate to="/account/bookings" replace />
      </AuthGate>
    </Section>
  );
}
