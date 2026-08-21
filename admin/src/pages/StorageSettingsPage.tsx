import { PageHeader } from "@/components/page-header";
import { EnvConfigNote } from "@/components/env-config-note";

export default function StorageSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Storage" description="Google Cloud Storage bucket for media and generated documents." />
      <EnvConfigNote variables={["GCP_PROJECT_ID", "GCP_BUCKET_NAME", "GCP_CREDENTIALS"]} />
    </div>
  );
}
