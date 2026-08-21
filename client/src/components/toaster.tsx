import { useEffect, useState } from "react";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { subscribeToToasts, type ToastMessage, type ToastTone } from "@/lib/toast";
import { cn } from "@/lib/utils";

const DURATION_MS = 4000;

const TONE_STYLES: Record<ToastTone, { icon: typeof CheckCircle2; accent: string }> = {
  success: { icon: CheckCircle2, accent: "text-teal" },
  error: { icon: XCircle, accent: "text-terracotta" },
  info: { icon: Info, accent: "text-gold" },
};

export function Toaster() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToToasts((toast) => {
      setToasts((current) => [...current, toast]);
      setTimeout(() => {
        setToasts((current) => current.filter((t) => t.id !== toast.id));
      }, DURATION_MS);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  function dismiss(id: number) {
    setToasts((current) => current.filter((t) => t.id !== id));
  }

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed bottom-6 right-6 z-[100] flex w-full max-w-sm flex-col gap-3"
    >
      {toasts.map((toast) => {
        const { icon: Icon, accent } = TONE_STYLES[toast.tone];
        return (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto flex items-start gap-3 rounded-xl border border-teal/10 bg-white p-4 shadow-lg"
          >
            <Icon size={18} className={cn("mt-0.5 shrink-0", accent)} />
            <p className="flex-1 text-sm leading-relaxed text-teal">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss notification"
              className="shrink-0 cursor-pointer text-slate transition-colors hover:text-teal"
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
