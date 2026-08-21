import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { Eye, EyeOff, LayoutDashboard, ScanLine, Ticket } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Logo } from "@/components/logo";
import { Button } from "@/components/button";
import { TextField } from "@/components/form-field";
import { ApiError } from "@/lib/api-client";

const HIGHLIGHTS = [
  { icon: Ticket, label: "Manage every gathering, ticket type and booking from one place." },
  { icon: ScanLine, label: "Scan attendees in at the gate with real-time check-in tracking." },
  { icon: LayoutDashboard, label: "See sales, revenue and attendance the moment they happen." },
];

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-ivory">
      <div className="relative hidden w-[45%] flex-col justify-between overflow-hidden bg-teal p-12 text-ivory lg:flex">
        <svg
          aria-hidden
          viewBox="0 0 400 400"
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 text-gold/15"
          fill="none"
        >
          <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="1" />
          <circle cx="200" cy="200" r="130" stroke="currentColor" strokeWidth="1" />
          <circle cx="200" cy="200" r="80" stroke="currentColor" strokeWidth="1" />
        </svg>

        <div className="relative flex items-center gap-3">
          <Logo mono className="h-12" />
          <span className="rounded-full bg-ivory/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-gold">
            Admin
          </span>
        </div>

        <div className="relative">
          <p className="text-2xl italic font-medium leading-snug text-ivory/95">
            Every gathering, run with care —
            <br />
            from the first ticket to the last song.
          </p>

          <div className="mt-10 flex flex-col gap-5">
            {HIGHLIGHTS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ivory/10">
                  <Icon size={16} className="text-gold" />
                </span>
                <p className="text-sm leading-relaxed text-ivory/75">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-ivory/40">© {new Date().getFullYear()} Kasepu Kalisi</p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Logo className="h-11 lg:hidden" />

          <h1 className="mt-6 text-2xl font-bold text-teal lg:mt-0">Welcome back</h1>
          <p className="mt-1.5 text-sm text-slate">Sign in to your operations dashboard.</p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
            <TextField
              label="Email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="relative">
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-[34px] text-slate hover:text-teal"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && (
              <p className="rounded-lg bg-terracotta/5 px-3 py-2 text-xs font-medium text-terracotta">{error}</p>
            )}

            <Button type="submit" disabled={loading} className="mt-2 w-full justify-center">
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-slate">
            Access is by invitation only. Contact a Super Admin if you need an account.
          </p>
        </div>
      </div>
    </div>
  );
}
