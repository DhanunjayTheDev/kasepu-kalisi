import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  message: string;
}

export function EmptyState({ icon: Icon, message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      {Icon && (
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate/10 text-slate">
          <Icon size={18} strokeWidth={1.75} />
        </span>
      )}
      <p className="text-sm text-slate">{message}</p>
    </div>
  );
}
