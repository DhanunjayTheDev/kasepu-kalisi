import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "teal" | "terracotta" | "gold" | "slate";

const TONE_CLASSES: Record<BadgeTone, string> = {
  teal: "bg-teal/10 text-teal",
  terracotta: "bg-terracotta/10 text-terracotta",
  gold: "bg-gold/15 text-gold",
  slate: "bg-slate/10 text-slate",
};

export function Badge({ children, tone = "slate" }: { children: ReactNode; tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
        TONE_CLASSES[tone]
      )}
    >
      {children}
    </span>
  );
}
