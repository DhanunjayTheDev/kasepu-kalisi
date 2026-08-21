import { PageHeader } from "@/components/page-header";
import { EnvConfigNote } from "@/components/env-config-note";

export default function EmailSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Email" description="Provider used to send booking, ticket and reminder emails." />
      <EnvConfigNote variables={["EMAIL_PROVIDER", "EMAIL_FROM", "SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"]} />
    </div>
  );
}
