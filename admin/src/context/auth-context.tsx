import { createContext, useContext, useState, type ReactNode } from "react";
import { apiFetch } from "@/lib/api-client";
import { readAuthState, writeAuthState, clearAuthState, type AuthState, type StoredStaff } from "@/lib/auth-storage";

interface AuthContextValue {
  staff: StoredStaff | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (...roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState | null>(() => readAuthState());

  async function login(email: string, password: string) {
    const result = await apiFetch<{ accessToken: string; refreshToken: string; staff: StoredStaff }>(
      "/api/auth/admin/login",
      { method: "POST", body: { email, password }, skipAuth: true }
    );
    const nextAuth: AuthState = { accessToken: result.accessToken, refreshToken: result.refreshToken, staff: result.staff };
    writeAuthState(nextAuth);
    setAuth(nextAuth);
  }

  function logout() {
    clearAuthState();
    setAuth(null);
  }

  function hasRole(...roles: string[]) {
    if (!auth) return false;
    if (auth.staff.role === "super_admin") return true;
    return roles.includes(auth.staff.role);
  }

  return (
    <AuthContext.Provider value={{ staff: auth?.staff ?? null, isAuthenticated: Boolean(auth), login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
