import { PageHeader } from "@/components/page-header";
import { EnvConfigNote } from "@/components/env-config-note";

export default function SecuritySettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Security" description="JWT and rate-limiting configuration for the API." />
      <EnvConfigNote
        variables={[
          "JWT_SECRET",
          "JWT_REFRESH_SECRET",
          "JWT_EXPIRES_IN",
          "JWT_REFRESH_EXPIRES_IN",
          "OTP_RATE_LIMIT_PER_HOUR",
        ]}
      />
    </div>
  );
}
