import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: ReactNode;
  className?: string;
  as?: "section" | "div";
}

export function Section({ children, className, as = "section" }: SectionProps) {
  const Comp = as;
  return (
    <Comp className={cn("py-10 sm:py-12 lg:py-16", className)}>
      <div className="container-kk">{children}</div>
    </Comp>
  );
}
