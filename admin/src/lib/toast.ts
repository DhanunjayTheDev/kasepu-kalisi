export type ToastTone = "success" | "error" | "info";

export interface ToastMessage {
  id: number;
  tone: ToastTone;
  message: string;
}

type Listener = (toast: ToastMessage) => void;

const listeners = new Set<Listener>();
let nextId = 0;

function emit(tone: ToastTone, message: string) {
  const toast: ToastMessage = { id: nextId++, tone, message };
  listeners.forEach((listener) => listener(toast));
}

/**
 * Module-level emitter so non-React code (the React Query mutation cache) can
 * raise toasts without needing access to a hook.
 */
export const toast = {
  success: (message: string) => emit("success", message),
  error: (message: string) => emit("error", message),
  info: (message: string) => emit("info", message),
};

export function subscribeToToasts(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
