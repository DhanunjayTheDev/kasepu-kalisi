import { PageHeader } from "@/components/page-header";
import { ScannerPanel } from "@/components/scanner-panel";

export default function ScannerPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Scanner"
        description="Scan a ticket QR, or enter a Ticket ID manually for check-in."
      />
      <ScannerPanel />
    </div>
  );
}
