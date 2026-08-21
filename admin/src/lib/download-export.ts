import { env } from "./env";
import { readAuthState } from "./auth-storage";

export async function downloadExport(type: string) {
  const auth = readAuthState();
  const response = await fetch(`${env.apiUrl}/api/reports/exports/${type}`, {
    headers: auth ? { Authorization: `Bearer ${auth.accessToken}` } : {},
  });

  if (!response.ok) throw new Error("Export failed");

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${type}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
