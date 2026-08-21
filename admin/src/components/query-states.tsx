import { AlertTriangle, Loader2 } from "lucide-react";

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 py-16 text-sm text-slate">
      <Loader2 size={16} className="animate-spin" />
      {label}
    </div>
  );
}

export function ErrorState({ message = "Something went wrong. Please try again." }: { message?: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-terracotta/20 bg-terracotta/5 px-5 py-4 text-sm text-terracotta">
      <AlertTriangle size={16} />
      {message}
    </div>
  );
}
