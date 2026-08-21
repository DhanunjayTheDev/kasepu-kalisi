import { NavLink } from "react-router-dom";
import { CalendarDays, Home, Ticket, User } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "Home", href: "/", icon: Home, end: true },
  { label: "Gatherings", href: "/events", icon: CalendarDays, end: false },
  { label: "Tickets", href: "/tickets", icon: Ticket, end: false },
];

/**
 * Native-style bottom tab bar. Mobile only — desktop keeps the header nav.
 * Sits above the home indicator via the safe-area inset.
 */
export function MobileTabBar() {
  const { isAuthenticated } = useAuth();

  const tabs = [
    ...TABS,
    {
      label: isAuthenticated ? "Account" : "Sign In",
      href: isAuthenticated ? "/account" : "/login",
      icon: User,
      end: false,
    },
  ];

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate/15 bg-ivory/95 pb-safe backdrop-blur-md lg:hidden"
    >
      <ul className="flex items-stretch">
        {tabs.map(({ label, href, icon: Icon, end }) => (
          <li key={href} className="flex-1">
            <NavLink
              to={href}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex h-[4.25rem] flex-col items-center justify-center gap-1 px-1 transition-colors",
                  isActive ? "text-terracotta" : "text-slate"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={21} strokeWidth={isActive ? 2.2 : 1.7} />
                  <span className={cn("font-sans text-[10px] leading-none", isActive ? "font-semibold" : "font-medium")}>
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
