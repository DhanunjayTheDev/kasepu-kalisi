import { env } from "./env";
import { readAuthState, writeAuthState, clearAuthState } from "./auth-storage";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  skipAuth?: boolean;
}

async function refreshAccessToken(): Promise<string | null> {
  const auth = readAuthState();
  if (!auth) return null;

  const response = await fetch(`${env.apiUrl}/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: auth.refreshToken }),
  });

  if (!response.ok) {
    // Clearing storage alone leaves the provider's in-memory state "signed in",
    // so the current screen keeps firing 401s. Reload onto the login route.
    clearAuthState();
    if (window.location.pathname !== "/login") {
      window.location.replace("/login");
    }
    return null;
  }

  const data = (await response.json()) as { accessToken: string };
  writeAuthState({ ...auth, accessToken: data.accessToken });
  return data.accessToken;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, skipAuth, headers, ...rest } = options;
  const auth = readAuthState();

  const doFetch = (token?: string) =>
    fetch(`${env.apiUrl}${path}`, {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        ...(token && !skipAuth ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

  let response = await doFetch(auth?.accessToken);

  if (response.status === 401 && auth && !skipAuth) {
    const newToken = await refreshAccessToken();
    if (newToken) response = await doFetch(newToken);
  }

  if (response.status === 204) return undefined as T;

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(response.status, data?.error?.message ?? "Something went wrong");
  }

  return data as T;
}
