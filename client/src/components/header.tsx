import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, LogOut, Menu, Ticket, User, X } from "lucide-react";
import { Button } from "@/components/button";
import { Logo } from "@/components/logo";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Gatherings", href: "/events" },
  { label: "About", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Venue", href: "/venue" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { pathname } = useLocation();

  // Menus are tied to the route they were opened on, so navigating away closes
  // them as derived state rather than through a setState-in-effect.
  const [menu, setMenu] = useState({ open: false, path: pathname });
  const [account, setAccount] = useState({ open: false, path: pathname });
  const menuOpen = menu.open && menu.path === pathname;
  const accountOpen = account.open && account.path === pathname;

  const setMenuOpen = (open: boolean) => setMenu({ open, path: pathname });
  const setAccountOpen = (open: boolean) => setAccount({ open, path: pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const firstName = user?.fullName?.split(" ")[0] ?? "Account";

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b bg-ivory/95 pt-safe backdrop-blur transition-all duration-300",
          scrolled ? "border-slate/15 shadow-[0_1px_0_0_rgba(30,108,113,0.08)]" : "border-transparent"
        )}
      >
        <div className="container-kk flex h-16 items-center justify-between gap-4 sm:h-20 sm:gap-6">
          <Link to="/" aria-label="Kasepu Kalisi — home" className="shrink-0">
            <Logo className="h-10 xs:h-11 sm:h-13 lg:h-14" />
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex xl:gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                end={link.href === "/"}
                className={({ isActive }) =>
                  cn(
                    "relative rounded-full px-2.5 py-2 font-sans text-sm font-medium transition-colors xl:px-3.5",
                    isActive ? "text-teal" : "text-slate hover:text-teal"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute inset-x-2.5 -bottom-0.5 h-px bg-terracotta xl:inset-x-3.5"
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="hidden shrink-0 items-center gap-3 lg:flex">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAccountOpen(!accountOpen)}
                  aria-expanded={accountOpen}
                  aria-label="Account menu"
                  className="flex cursor-pointer items-center gap-2 rounded-full border border-slate/20 py-1.5 pl-1.5 pr-4 font-sans text-sm font-medium text-teal transition-colors hover:border-teal/40"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal text-ivory">
                    <User size={15} />
                  </span>
                  {firstName}
                </button>

                {accountOpen && (
                  <div className="absolute right-0 top-12 w-52 rounded-xl border border-slate/15 bg-white p-2 shadow-lg">
                    <Link
                      to="/account"
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 font-sans text-sm text-teal transition-colors hover:bg-teal/5"
                    >
                      <User size={15} /> My Account
                    </Link>
                    <Link
                      to="/account/bookings"
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 font-sans text-sm text-teal transition-colors hover:bg-teal/5"
                    >
                      <Ticket size={15} /> My Bookings
                    </Link>
                    <button
                      type="button"
                      onClick={logout}
                      className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 font-sans text-sm text-terracotta transition-colors hover:bg-terracotta/5"
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="group/signin relative rounded-full px-3.5 py-2 font-sans text-sm font-medium text-teal transition-colors hover:bg-teal/5"
              >
                Sign In
                <span
                  aria-hidden
                  className="absolute inset-x-3.5 bottom-1 h-px origin-left scale-x-0 bg-terracotta transition-transform duration-300 ease-out group-hover/signin:scale-x-100 group-focus-visible/signin:scale-x-100"
                />
              </Link>
            )}

            <Button href="/events" variant="primary" className="px-5 py-2.5">
              Reserve a Seat
            </Button>
          </div>

          {/* Tablets have room for the primary action beside the menu button. */}
          <div className="flex shrink-0 items-center gap-2 lg:hidden">
            <Button href="/events" variant="primary" className="hidden px-5 py-2.5 md:inline-flex">
              Reserve a Seat
            </Button>
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
              className="tap-target -mr-2 flex cursor-pointer items-center justify-center rounded-full text-teal transition-colors active:bg-teal/10"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen sheet — reads as a native drawer rather than a dropdown. */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-teal/30 backdrop-blur-sm lg:hidden"
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="ml-auto flex h-full w-[86%] max-w-sm flex-col bg-ivory pt-safe"
            >
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate/12 px-5">
                <Logo className="h-10" />
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setMenuOpen(false)}
                  className="tap-target -mr-2 flex cursor-pointer items-center justify-center rounded-full text-teal active:bg-teal/10"
                >
                  <X size={22} />
                </button>
              </div>

              <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
                {NAV_LINKS.map((link) => (
                  <NavLink
                    key={link.href}
                    to={link.href}
                    end={link.href === "/"}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center justify-between rounded-xl px-4 py-3.5 font-sans text-base font-medium transition-colors active:bg-teal/10",
                        isActive ? "bg-teal/8 text-teal" : "text-teal/80"
                      )
                    }
                  >
                    {link.label}
                    <ChevronRight size={16} className="text-slate/50" />
                  </NavLink>
                ))}

                <div className="my-3 border-t border-slate/12" />

                {isAuthenticated ? (
                  <>
                    <NavLink
                      to="/account"
                      className="flex items-center justify-between rounded-xl px-4 py-3.5 font-sans text-base font-medium text-teal/80 active:bg-teal/10"
                    >
                      Hi, {firstName}
                      <ChevronRight size={16} className="text-slate/50" />
                    </NavLink>
                    <NavLink
                      to="/account/bookings"
                      className="flex items-center justify-between rounded-xl px-4 py-3.5 font-sans text-base font-medium text-teal/80 active:bg-teal/10"
                    >
                      My Bookings
                      <ChevronRight size={16} className="text-slate/50" />
                    </NavLink>
                    <button
                      type="button"
                      onClick={logout}
                      className="flex w-full cursor-pointer items-center rounded-xl px-4 py-3.5 text-left font-sans text-base font-medium text-terracotta active:bg-terracotta/10"
                    >
                      <LogOut size={17} className="mr-2.5" /> Sign Out
                    </button>
                  </>
                ) : (
                  <NavLink
                    to="/login"
                    className="flex items-center justify-between rounded-xl px-4 py-3.5 font-sans text-base font-medium text-teal/80 active:bg-teal/10"
                  >
                    Sign In
                    <ChevronRight size={16} className="text-slate/50" />
                  </NavLink>
                )}
              </nav>

              <div className="shrink-0 border-t border-slate/12 p-4 pb-safe">
                <Button href="/events" variant="primary" className="w-full">
                  Reserve a Seat
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
