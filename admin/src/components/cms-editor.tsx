import type { FormEvent, ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/button";

interface CmsEditorProps {
  children: ReactNode;
  note?: string;
  onSubmit: (e: FormEvent) => void;
  isPending?: boolean;
  isSaved?: boolean;
}

export function CmsEditor({
  children,
  note = "Changes publish immediately to the live site.",
  onSubmit,
  isPending,
  isSaved,
}: CmsEditorProps) {
  return (
    <form onSubmit={onSubmit} className="flex max-w-2xl flex-col gap-5 rounded-2xl border border-teal/10 bg-white p-6">
      {children}
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving…" : "Save Changes"}
        </Button>
        {isSaved && (
          <span className="flex items-center gap-1.5 text-sm text-teal">
            <CheckCircle2 size={16} /> Saved
          </span>
        )}
      </div>
      <p className="text-xs text-slate">{note}</p>
    </form>
  );
}
