import { Check, X } from "lucide-react";
import { PageHeader } from "@/components/page-header";

const ROLES = ["Super Admin", "Event Manager", "Finance Manager", "Registration Manager", "Check-in Staff", "Content Manager", "Support Staff"];

const PERMISSIONS: { label: string; allowed: boolean[] }[] = [
  { label: "Scan & check-in", allowed: [true, true, false, true, true, false, false] },
  { label: "Edit ticket prices", allowed: [true, true, true, false, false, false, false] },
  { label: "Issue refunds", allowed: [true, false, true, false, false, false, false] },
  { label: "Delete events", allowed: [true, false, false, false, false, false, false] },
  { label: "Manage staff & roles", allowed: [true, false, false, false, false, false, false] },
  { label: "Edit CMS content", allowed: [true, false, false, false, false, true, false] },
  { label: "View reports", allowed: [true, true, true, true, false, false, false] },
];

export default function RolesSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Roles" description="Role-based permissions, enforced server-side on every request." />

      <div className="overflow-x-auto rounded-2xl border border-teal/10 bg-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-teal/10">
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate">Permission</th>
              {ROLES.map((role) => (
                <th key={role} className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate">
                  {role}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-teal/5">
            {PERMISSIONS.map((row) => (
              <tr key={row.label}>
                <td className="px-5 py-4 font-medium text-teal">{row.label}</td>
                {row.allowed.map((allowed, i) => (
                  <td key={ROLES[i]} className="px-5 py-4">
                    {allowed ? (
                      <Check size={16} className="text-teal" />
                    ) : (
                      <X size={16} className="text-slate/40" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
