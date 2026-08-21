import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  PlusCircle,
  Clock,
  Mic2,
  UtensilsCrossed,
  Images,
  Ticket,
  Boxes,
  Tag,
  ListPlus,
  ClipboardList,
  UserSquare2,
  Wallet,
  Undo2,
  ScanLine,
  Radio,
  History as HistoryIcon,
  MonitorPlay,
  Megaphone,
  ParkingSquare,
  LifeBuoy,
  BarChart3,
  TrendingUp,
  Users2,
  FileDown,
  Users,
  IdCard,
  FileText,
  Settings,
  CreditCard,
  Receipt,
  Mail,
  MessageCircle,
  Database,
  ShieldCheck,
  KeyRound,
  History,
  ChevronDown,
  Quote,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";

const NAV_SECTIONS = [
  {
    items: [{ label: "Dashboard", href: "/", icon: LayoutDashboard }],
  },
  {
    heading: "Events",
    icon: CalendarDays,
    items: [
      { label: "All Events", href: "/events", icon: CalendarDays },
      { label: "Create Event", href: "/events/new", icon: PlusCircle },
      { label: "Schedules", href: "/events/schedules", icon: Clock },
      { label: "Artists", href: "/events/artists", icon: Mic2 },
      { label: "Menu", href: "/events/menu", icon: UtensilsCrossed },
      { label: "Gallery", href: "/events/gallery", icon: Images },
    ],
  },
  {
    heading: "Tickets",
    icon: Ticket,
    items: [
      { label: "Ticket Types", href: "/tickets", icon: Ticket },
      { label: "Inventory", href: "/tickets/inventory", icon: Boxes },
      { label: "Coupons", href: "/tickets/coupons", icon: Tag },
      { label: "Waitlist", href: "/tickets/waitlist", icon: ListPlus },
    ],
  },
  {
    heading: "Bookings",
    icon: ClipboardList,
    items: [
      { label: "All Bookings", href: "/bookings", icon: ClipboardList },
      { label: "Attendees", href: "/bookings/attendees", icon: UserSquare2 },
      { label: "Payments", href: "/bookings/payments", icon: Wallet },
      { label: "Refunds", href: "/bookings/refunds", icon: Undo2 },
    ],
  },
  {
    heading: "Check-in",
    icon: ScanLine,
    items: [
      { label: "Scanner", href: "/checkin", icon: ScanLine },
      { label: "Live Attendance", href: "/checkin/live", icon: Radio },
      { label: "Check-in History", href: "/checkin/history", icon: HistoryIcon },
    ],
  },
  {
    heading: "Operations",
    icon: MonitorPlay,
    items: [
      { label: "Event Control Center", href: "/operations/control-center", icon: MonitorPlay },
      { label: "Announcements", href: "/operations/announcements", icon: Megaphone },
      { label: "Parking", href: "/operations/parking", icon: ParkingSquare },
      { label: "Support", href: "/operations/support", icon: LifeBuoy },
    ],
  },
  {
    heading: "Reports",
    icon: BarChart3,
    items: [
      { label: "Sales", href: "/reports", icon: BarChart3 },
      { label: "Revenue", href: "/reports/revenue", icon: TrendingUp },
      { label: "Attendance", href: "/reports/attendance", icon: Users2 },
      { label: "Exports", href: "/reports/exports", icon: FileDown },
    ],
  },
  {
    heading: "Users",
    icon: Users,
    items: [
      { label: "Attendees", href: "/users", icon: Users },
      { label: "Staff", href: "/users/staff", icon: IdCard },
    ],
  },
  {
    heading: "CMS",
    icon: FileText,
    items: [
      { label: "Homepage", href: "/cms", icon: FileText },
      { label: "About", href: "/cms/about", icon: FileText },
      { label: "FAQ", href: "/cms/faq", icon: FileText },
      { label: "Testimonials", href: "/cms/testimonials", icon: Quote },
      { label: "Contact", href: "/cms/contact", icon: FileText },
    ],
  },
  {
    heading: "Settings",
    icon: Settings,
    items: [
      { label: "General", href: "/settings", icon: Settings },
      { label: "Payments", href: "/settings/payments", icon: CreditCard },
      { label: "Tax", href: "/settings/tax", icon: Receipt },
      { label: "Email", href: "/settings/email", icon: Mail },
      { label: "WhatsApp", href: "/settings/whatsapp", icon: MessageCircle },
      { label: "Storage", href: "/settings/storage", icon: Database },
      { label: "Roles", href: "/settings/roles", icon: KeyRound },
      { label: "Security", href: "/settings/security", icon: ShieldCheck },
    ],
  },
  {
    items: [{ label: "Audit Logs", href: "/audit-logs", icon: History }],
  },
];

function isSectionActive(section: (typeof NAV_SECTIONS)[number], pathname: string) {
  return section.items.some((item) => (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)));
}

export function Sidebar() {
  const { pathname } = useLocation();
  const activeHeading = NAV_SECTIONS.find((s) => s.heading && isSectionActive(s, pathname))?.heading;
  const [toggled, setToggled] = useState<Record<string, boolean>>({});

  function isOpen(heading: string) {
    return toggled[heading] ?? heading === activeHeading;
  }

  function toggleSection(heading: string) {
    setToggled((prev) => ({ ...prev, [heading]: !isOpen(heading) }));
  }

  return (
    <aside className="hidden w-72 shrink-0 flex-col overflow-hidden border-r border-teal/10 bg-white py-6 lg:flex">
      <Link to="/" className="block px-6" aria-label="Kasepu Kalisi Admin — dashboard">
        <Logo className="h-11" />
      </Link>

      <nav className="mt-8 min-h-0 flex-1 overflow-y-auto px-4">
        <div className="flex flex-col gap-1">
          {NAV_SECTIONS.map((section, index) => {
            if (!section.heading) {
              return (
                <div key={index} className="flex flex-col gap-0.5 py-1">
                  {section.items.map(({ label, href, icon: Icon }) => {
                    const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
                    return (
                      <Link
                        key={href}
                        to={href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm font-medium transition-colors",
                          active ? "bg-teal/8 text-teal" : "text-teal/70 hover:bg-teal/5 hover:text-teal"
                        )}
                      >
                        <Icon size={17} strokeWidth={1.75} />
                        {label}
                      </Link>
                    );
                  })}
                </div>
              );
            }

            const open = isOpen(section.heading);
            const sectionActive = isSectionActive(section, pathname);
            const SectionIcon = section.icon;

            return (
              <div key={section.heading} className="border-t border-teal/5 py-1 first:border-t-0">
                <button
                  type="button"
                  onClick={() => toggleSection(section.heading!)}
                  aria-expanded={open}
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-3 rounded-lg px-2 py-2.5 text-sm font-semibold transition-colors hover:bg-teal/5",
                    sectionActive && !open ? "text-terracotta" : "text-teal"
                  )}
                >
                  {SectionIcon && <SectionIcon size={17} strokeWidth={1.75} />}
                  <span className="flex-1 text-left">{section.heading}</span>
                  <ChevronDown
                    size={15}
                    className={cn("shrink-0 text-slate transition-transform duration-200", open && "rotate-180")}
                  />
                </button>

                {open && (
                  <div className="mt-0.5 flex flex-col gap-0.5 border-l border-teal/10 pl-4">
                    {section.items.map(({ label, href, icon: Icon }) => {
                      const isActive = pathname === href;
                      return (
                        <Link
                          key={href}
                          to={href}
                          className={cn(
                            "flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm font-medium transition-colors",
                            isActive ? "bg-teal/8 text-teal" : "text-teal/60 hover:bg-teal/5 hover:text-teal"
                          )}
                        >
                          <Icon size={15} strokeWidth={1.75} />
                          {label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
