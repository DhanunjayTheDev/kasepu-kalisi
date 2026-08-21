export interface StoredStaff {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthState {
  accessToken: string;
  refreshToken: string;
  staff: StoredStaff;
}

const STORAGE_KEY = "kk-admin-auth";

export function readAuthState(): AuthState | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthState;
  } catch {
    return null;
  }
}

export function writeAuthState(state: AuthState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearAuthState() {
  window.localStorage.removeItem(STORAGE_KEY);
}
