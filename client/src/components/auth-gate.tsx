import { useState, type ReactNode, type FormEvent } from "react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/button";
import { TextField } from "@/components/form-field";
import { ApiError } from "@/lib/api-client";

export function AuthGate({ children }: { children: ReactNode }) {
  const { isAuthenticated, requestOtp, verifyOtp } = useAuth();
  const [stage, setStage] = useState<"contact" | "otp">("contact");
  const [mobile, setMobile] = useState("");
  const [fullName, setFullName] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <>{children}</>;

  async function handleSendOtp(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }
    setLoading(true);
    try {
      await requestOtp(mobile);
      setStage("otp");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await verifyOtp(mobile, otp, fullName || undefined);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <span className="eyebrow text-gold">Verify to Continue</span>
      <h1 className="mt-2 text-3xl">Confirm it&apos;s you.</h1>
      <p className="mt-3 text-sm leading-relaxed text-slate">
        We verify your mobile number to keep your bookings and tickets secure.
      </p>

      {stage === "contact" ? (
        <form onSubmit={handleSendOtp} className="mt-8 flex flex-col gap-5">
          <TextField
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <TextField
            label="Mobile Number"
            placeholder="98765 43210"
            inputMode="numeric"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
          {error && <p className="text-xs font-medium text-terracotta">{error}</p>}
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Sending…" : "Send OTP"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="mt-8 flex flex-col gap-5">
          <TextField
            label="Enter OTP"
            hint={`A 4-digit code was sent to ${mobile}`}
            inputMode="numeric"
            maxLength={4}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          {error && <p className="text-xs font-medium text-terracotta">{error}</p>}
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Verifying…" : "Verify & Continue"}
          </Button>
        </form>
      )}
    </div>
  );
}
