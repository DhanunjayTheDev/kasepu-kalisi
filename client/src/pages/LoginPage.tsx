import { Link, Navigate, useLocation } from "react-router-dom";
import { ArrowLeft, CalendarCheck, QrCode, ShieldCheck } from "lucide-react";
import { AuthGate } from "@/components/auth-gate";
import { Logo } from "@/components/logo";
import { useAuth } from "@/context/auth-context";
import { usePageTitle } from "@/lib/use-page-title";
import { media } from "@/lib/media";

const BENEFITS = [
  { icon: CalendarCheck, label: "See every gathering you've booked, in one place." },
  { icon: QrCode, label: "Pull up your QR ticket instantly at the gate." },
  { icon: ShieldCheck, label: "No password to remember — just your mobile number." },
];

export default function LoginPage() {
  usePageTitle("Sign In");
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/account";

  if (isAuthenticated) return <Navigate to={from} replace />;

  return (
    <div className="flex min-h-screen bg-ivory">
      <div className="relative hidden w-[48%] overflow-hidden lg:block">
        <img src={media.tableWithFlowers} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div aria-hidden className="absolute inset-0 bg-teal/80" />

        <svg
          aria-hidden
          viewBox="0 0 400 400"
          className="pointer-events-none absolute -right-28 -top-24 h-96 w-96 text-gold/20"
          fill="none"
        >
          <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="1" />
          <circle cx="200" cy="200" r="130" stroke="currentColor" strokeWidth="1" />
        </svg>

        <div className="relative flex h-full flex-col justify-between p-12">
          <Link to="/" aria-label="Kasepu Kalisi — home">
            <Logo mono className="h-14" />
          </Link>

          <div>
            <span className="eyebrow flex items-center gap-3 text-gold">
              <span className="h-px w-8 bg-gold" aria-hidden />
              Welcome Back
            </span>
            <h1 className="mt-5 max-w-md text-4xl leading-tight text-ivory sm:text-5xl">
              Come, <span className="italic text-gold">sit with us.</span>
            </h1>

            <div className="mt-10 flex flex-col gap-5">
              {BENEFITS.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ivory/10">
                    <Icon size={16} className="text-gold" />
                  </span>
                  <p className="max-w-sm text-sm leading-relaxed text-ivory/75">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-ivory/40">© {new Date().getFullYear()} Kasepu Kalisi</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-6 py-8 sm:px-10">
        <Link
          to="/"
          className="flex w-fit items-center gap-2 rounded-full px-3 py-2 font-sans text-sm font-medium text-slate transition-colors hover:text-teal"
        >
          <ArrowLeft size={15} /> Back to site
        </Link>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <Link to="/" aria-label="Kasepu Kalisi — home" className="mb-8 block lg:hidden">
              <Logo className="h-12" />
            </Link>

            <AuthGate>{null}</AuthGate>

            <p className="mt-10 text-center text-xs leading-relaxed text-slate">
              New here? Signing in with your mobile number creates your account automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
