import { useState } from "react";
import { ScanLine, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/button";
import { TextField } from "@/components/form-field";
import { useScanTicket } from "@/lib/queries";
import { cn } from "@/lib/utils";

export function ScannerPanel() {
  const [ticketId, setTicketId] = useState("");
  const scanTicket = useScanTicket();

  function handleCheck(e: React.FormEvent) {
    e.preventDefault();
    if (!ticketId) return;
    scanTicket.mutate({ ticketId }, { onSuccess: () => setTicketId("") });
  }

  const result = scanTicket.data;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-teal/25 bg-white p-12 text-center">
        <ScanLine size={32} className="text-teal/50" strokeWidth={1.5} />
        <p className="text-sm text-slate">Camera preview appears here once scanner access is granted.</p>
      </div>

      <div className="flex flex-col gap-6">
        <form onSubmit={handleCheck} className="flex flex-col gap-4 rounded-2xl border border-teal/10 bg-white p-6">
          <p className="text-sm font-semibold text-teal">Manual Entry Fallback</p>
          <TextField
            label="Ticket ID"
            placeholder="KK-TKT-8F72A91C"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
          />
          <Button type="submit" className="self-start" disabled={scanTicket.isPending}>
            {scanTicket.isPending ? "Checking…" : "Check Ticket"}
          </Button>
        </form>

        {result && (
          <div className={resultClasses(result.result)}>
            {result.result === "approved" && <CheckCircle2 size={22} />}
            {result.result === "duplicate" && <AlertTriangle size={22} />}
            {result.result === "invalid" && <XCircle size={22} />}
            <div>
              <p className="font-semibold">
                {result.result === "approved" && "Entry Approved"}
                {result.result === "duplicate" && "Ticket Already Used"}
                {result.result === "invalid" && "Invalid Ticket"}
              </p>
              <p className="text-xs opacity-80">{result.message}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function resultClasses(result: string) {
  return cn(
    "flex items-center gap-3 rounded-2xl p-5 text-sm",
    result === "approved" && "bg-teal/10 text-teal",
    result === "duplicate" && "bg-gold/15 text-gold",
    result === "invalid" && "bg-terracotta/10 text-terracotta"
  );
}
