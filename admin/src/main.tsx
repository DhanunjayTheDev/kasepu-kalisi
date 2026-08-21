import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { AuthProvider } from "./context/auth-context";
import { Toaster } from "./components/toaster";
import { ApiError } from "./lib/api-client";
import { toast } from "./lib/toast";
import "./index.css";

/**
 * Every mutation raises a toast from here, so no call site has to remember to.
 * Pass `meta: { success: "…" }` to a mutation for wording specific to that action.
 */
const mutationCache = new MutationCache({
  onSuccess: (_data, _variables, _context, mutation) => {
    const message = (mutation.meta?.success as string | undefined) ?? "Saved.";
    toast.success(message);
  },
  onError: (error, _variables, _context, mutation) => {
    const fallback = (mutation.meta?.error as string | undefined) ?? "Something went wrong.";
    toast.error(error instanceof ApiError ? error.message : fallback);
  },
});

const queryClient = new QueryClient({
  mutationCache,
  defaultOptions: {
    queries: { retry: 1, staleTime: 15_000 },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <App />
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
