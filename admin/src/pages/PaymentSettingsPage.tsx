import { PageHeader } from "@/components/page-header";
import { EnvConfigNote } from "@/components/env-config-note";

export default function PaymentSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Payments" description="Razorpay keys used to create orders and verify payments." />
      <EnvConfigNote variables={["RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET", "RAZORPAY_WEBHOOK_SECRET"]} />
    </div>
  );
}
