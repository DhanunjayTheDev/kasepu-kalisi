import { useState } from "react";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/confirm-dialog";

interface ConfirmDeleteButtonProps {
  onConfirm: () => void;
  disabled?: boolean;
  title?: string;
  body?: string;
}

export function ConfirmDeleteButton({
  onConfirm,
  disabled,
  title = "Delete this record?",
  body = "This permanently removes it. This action can't be undone.",
}: ConfirmDeleteButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(true)}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate transition-colors hover:bg-terracotta/10 hover:text-terracotta disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Delete"
      >
        <Trash2 size={15} />
      </button>

      <ConfirmDialog
        open={open}
        title={title}
        body={body}
        pending={disabled}
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          setOpen(false);
          onConfirm();
        }}
      />
    </>
  );
}
