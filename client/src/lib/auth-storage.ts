export interface StoredUser {
  id: string;
  fullName: string;
  mobile: string;
  email?: string;
}

export interface AuthState {
  accessToken: string;
  refreshToken: string;
  user: StoredUser;
}

const STORAGE_KEY = "kk-auth";

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
