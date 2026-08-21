import { PageHeader } from "@/components/page-header";
import { EnvConfigNote } from "@/components/env-config-note";

export default function WhatsAppSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="WhatsApp" description="Meta WhatsApp Cloud API used for ticket delivery and reminders." />
      <EnvConfigNote variables={["WHATSAPP_API_KEY", "WHATSAPP_PHONE_NUMBER_ID"]} />
    </div>
  );
}
