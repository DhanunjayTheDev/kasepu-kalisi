import { ShieldCheck } from "lucide-react";

export function EnvConfigNote({ variables }: { variables: string[] }) {
  return (
    <div className="max-w-xl rounded-2xl border border-teal/10 bg-white p-6">
      <div className="flex items-start gap-3">
        <ShieldCheck size={20} className="mt-0.5 shrink-0 text-teal" />
        <div>
          <p className="text-sm font-semibold text-teal">Configured via server environment variables</p>
          <p className="mt-1 text-sm text-slate">
            These are secrets — they're set in the server&apos;s <code>.env</code> file and never stored in the
            database or sent to the browser, so they can&apos;t be edited from this screen.
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-1.5 rounded-xl bg-ivory px-4 py-3 font-mono text-xs text-slate">
        {variables.map((v) => (
          <span key={v}>{v}</span>
        ))}
      </div>
    </div>
  );
}
