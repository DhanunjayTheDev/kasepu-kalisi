import { Section } from "@/components/section";
import { RegisterFlow } from "@/components/register-flow";
import { AuthGate } from "@/components/auth-gate";
import { usePageTitle } from "@/lib/use-page-title";

export default function RegisterPage() {
  usePageTitle("Register", "Reserve your seat at a Kasepu Kalisi gathering.");

  return (
    <Section>
      <AuthGate>
        <RegisterFlow />
      </AuthGate>
    </Section>
  );
}
