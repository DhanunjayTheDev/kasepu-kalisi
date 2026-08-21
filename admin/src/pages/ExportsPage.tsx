import { useState } from "react";
import { FileDown } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/button";
import { downloadExport } from "@/lib/download-export";

const EXPORTS = [
  { label: "Attendees", type: "attendees" },
  { label: "Bookings", type: "bookings" },
  { label: "Payments", type: "payments" },
  { label: "Refunds", type: "refunds" },
  { label: "Check-ins", type: "checkins" },
];

export default function ExportsPage() {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleExport(type: string) {
    setLoading(type);
    try {
      await downloadExport(type);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Exports" description="Download CSV exports of current records." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {EXPORTS.map((item) => (
          <div key={item.type} className="flex items-center justify-between rounded-2xl border border-teal/10 bg-white p-5">
            <p className="font-semibold text-teal">{item.label}</p>
            <Button variant="outline" disabled={loading === item.type} onClick={() => handleExport(item.type)}>
              <FileDown size={16} /> {loading === item.type ? "Preparing…" : "CSV"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
