import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  accent?: "teal" | "terracotta" | "gold" | "slate";
}

const ACCENT_CLASSES: Record<NonNullable<StatCardProps["accent"]>, string> = {
  teal: "bg-teal/10 text-teal",
  terracotta: "bg-terracotta/10 text-terracotta",
  gold: "bg-gold/15 text-gold",
  slate: "bg-slate/10 text-slate",
};

export function StatCard({ label, value, icon: Icon, accent = "teal" }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-teal/10 bg-white p-5">
      <span
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full",
          ACCENT_CLASSES[accent]
        )}
      >
        <Icon size={18} strokeWidth={1.75} />
      </span>
      <p className="mt-4 text-2xl font-bold text-teal">{value}</p>
      <p className="mt-1 text-sm text-slate">{label}</p>
    </div>
  );
}
