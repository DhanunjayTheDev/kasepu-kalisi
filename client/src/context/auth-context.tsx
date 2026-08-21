import { createContext, useContext, useState, type ReactNode } from "react";
import { apiFetch } from "@/lib/api-client";
import { readAuthState, writeAuthState, clearAuthState, type AuthState, type StoredUser } from "@/lib/auth-storage";

interface AuthContextValue {
  user: StoredUser | null;
  isAuthenticated: boolean;
  requestOtp: (mobile: string) => Promise<void>;
  verifyOtp: (mobile: string, otp: string, fullName?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState | null>(() => readAuthState());

  async function requestOtp(mobile: string) {
    await apiFetch("/api/auth/otp/request", { method: "POST", body: { mobile }, skipAuth: true });
  }

  async function verifyOtp(mobile: string, otp: string, fullName?: string) {
    const result = await apiFetch<{ accessToken: string; refreshToken: string; user: StoredUser }>(
      "/api/auth/otp/verify",
      { method: "POST", body: { mobile, otp, fullName }, skipAuth: true }
    );
    const nextAuth: AuthState = { accessToken: result.accessToken, refreshToken: result.refreshToken, user: result.user };
    writeAuthState(nextAuth);
    setAuth(nextAuth);
  }

  function logout() {
    clearAuthState();
    setAuth(null);
  }

  return (
    <AuthContext.Provider
      value={{ user: auth?.user ?? null, isAuthenticated: Boolean(auth), requestOtp, verifyOtp, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
