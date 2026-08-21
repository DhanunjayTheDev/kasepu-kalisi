import { LogOut, User } from "lucide-react";
import { Button } from "@/components/button";
import { Section } from "@/components/section";
import { AuthGate } from "@/components/auth-gate";
import { useAuth } from "@/context/auth-context";
import { usePageTitle } from "@/lib/use-page-title";

function AccountContent() {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-lg">
      <span className="eyebrow text-gold">Your Account</span>
      <h1 className="mt-2 text-4xl">Welcome back.</h1>

      <div className="mt-8 flex items-center gap-4 rounded-2xl border border-slate/15 p-6">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-teal/10 text-teal">
          <User size={24} />
        </span>
        <div>
          <p className="font-display text-xl text-teal">{user?.fullName}</p>
          <p className="text-sm text-slate">
            +91 {user?.mobile}
            {user?.email ? ` · ${user.email}` : ""}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-4">
        <Button href="/account/bookings" variant="primary">
          Your Bookings
        </Button>
        <Button href="/contact" variant="outline">
          Contact Support
        </Button>
        <Button type="button" variant="ghost" onClick={logout}>
          <LogOut size={16} /> Sign Out
        </Button>
      </div>
    </div>
  );
}

export default function AccountPage() {
  usePageTitle("Your Account");

  return (
    <Section>
      <AuthGate>
        <AccountContent />
      </AuthGate>
    </Section>
  );
}
