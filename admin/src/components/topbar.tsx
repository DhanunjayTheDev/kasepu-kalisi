import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Search } from "lucide-react";
import { useAuth } from "@/context/auth-context";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Topbar() {
  const { staff, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const term = query.trim();
    if (term) navigate(`/bookings?q=${encodeURIComponent(term)}`);
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-teal/10 bg-white px-6">
      <form onSubmit={handleSearch} className="flex items-center gap-2 rounded-lg bg-ivory px-3 py-2">
        <Search size={16} className="shrink-0 text-slate" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search bookings by ID, name, mobile or email…"
          aria-label="Search bookings"
          className="w-64 bg-transparent text-sm text-teal placeholder:text-slate focus:outline-none sm:w-80"
        />
      </form>

      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Account menu"
          aria-expanded={menuOpen}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-teal text-sm font-semibold text-ivory transition-colors hover:bg-teal/90"
        >
          {staff ? initials(staff.name) : "?"}
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-11 w-52 rounded-xl border border-teal/10 bg-white p-3 shadow-lg">
            <p className="text-sm font-semibold text-teal">{staff?.name}</p>
            <p className="mt-0.5 text-xs capitalize text-slate">{staff?.role.replace(/_/g, " ")}</p>
            <button
              type="button"
              onClick={logout}
              className="mt-3 flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-terracotta hover:bg-terracotta/5"
            >
              <LogOut size={15} /> Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
