"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { UserRound, ChevronDown, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import Logo from "@/components/global/Logo";

/* ─── types ─────────────────────────────────────────────── */
type MegaItem = { label: string; href: string; icon: React.ReactNode; description: string };
type NavItem =
  | { label: string; href: string; mega?: never }
  | { label: string; href?: never; mega: { left: { heading: string; items: MegaItem[] } } };

const productMega = {
  left: {
    heading: "Products",
    items: [
      {
        label: "Developer Dashboard",
        href: "/dashboard",
        icon: <LayoutDashboard className="h-[18px] w-[18px]" />,
        description: "Track your progress, stats & learning paths",
      },
      {
        label: "Developer Application",
        href: "/for-developer",
        icon: <UserRound className="h-[18px] w-[18px]" />,
        description: "Apply for exclusive developer platform access",
      },
    ],
  },
};

const navItems: NavItem[] = [
  { label: "For Developer", href: "/dashboard" },
  { label: "Pricing", href: "/pricing" },
  { label: "For Companies", href: "/for-companies" },
];

/* ─── MegaMenu (desktop) ─────────────────────────────────── */
function MegaMenu({
  mega,
  label,
}: {
  mega: NonNullable<Extract<NavItem, { mega: unknown }>["mega"]>;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => { if (timer.current) clearTimeout(timer.current); setOpen(true); };
  const hide = () => { timer.current = setTimeout(() => setOpen(false), 150); };
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return (
    <div ref={ref} className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        className="flex items-center gap-1 py-2 text-[15px] font-medium text-secondary transition-colors hover:text-primary"
      >
        {label}
        <ChevronDown
          strokeWidth={2.5}
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* ── Mega panel ── */}
      <div
        className={`absolute left-1/2 top-full z-50 mt-3 -translate-x-1/2 transition-all duration-200 ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
        style={{ width: "600px" }}
      >
        {/* Caret */}
        <div className="flex justify-center">
          <div className="h-0 w-0 border-l-[8px] border-r-[8px] border-b-[8px] border-l-transparent border-r-transparent border-b-slate-100" />
        </div>

        {/* Panel */}
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl">
          <div>
            {/* Left column */}
            <div className="p-6">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.12em] text-primary">
                {mega.left.heading}
              </p>
              <div className="flex flex-col gap-1">
                {mega.left.items.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="group flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors duration-150 hover:bg-primary/5"
                  >
                    <span className="mt-0.5 shrink-0 text-primary opacity-70 transition-opacity group-hover:opacity-100">
                      {item.icon}
                    </span>
                    <div>
                      <p className="text-[14px] font-semibold text-secondary group-hover:text-primary">
                        {item.label}
                      </p>
                      <p className="mt-0.5 text-[12px] leading-snug text-slate-400 group-hover:text-slate-500">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}

/* ─── Main Header ────────────────────────────────────────── */
export default function Header() {
  const { user, loading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [productMobileOpen, setProductMobileOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!userMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node))
        setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [userMenuOpen]);

  useEffect(() => {
    if (!userMenuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setUserMenuOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [userMenuOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-100/50 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6 lg:px-8">
          {/* Logo */}
          <div className="flex shrink-0 items-center">
            <Logo priority width={120} height={48} />
          </div>

          {/* Desktop nav */}
          <nav className="hidden flex-1 items-center justify-center gap-8 lg:flex">
            {navItems.map((item) =>
              item.mega ? (
                <MegaMenu key={item.label} mega={item.mega} label={item.label} />
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="py-2 text-[15px] font-medium text-secondary transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Right actions */}
          <div className="flex items-center justify-end gap-4">
            {loading ? (
              <span className="hidden text-sm text-slate-400 sm:block">…</span>
            ) : user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:border-primary/30 hover:text-primary"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="menu"
                >
                  <UserRound className="h-4 w-4" strokeWidth={2} />
                  <span className="sr-only">Account menu</span>
                </button>
                {userMenuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-slate-100 bg-white py-2 shadow-xl"
                  >
                    <div className="border-b border-slate-100 px-4 py-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Signed in</p>
                      <p className="mt-1 truncate text-sm font-semibold text-secondary">{user.name ?? user.email}</p>
                    </div>
                    <Link href="/dashboard/profile" role="menuitem" onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-primary/5 hover:text-primary">
                      Profile
                    </Link>
                    <Link href="/dashboard" role="menuitem" onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-primary/5 hover:text-primary">
                      Dashboard
                    </Link>
                    <button type="button" role="menuitem"
                      onClick={() => { setUserMenuOpen(false); void logout(); }}
                      className="w-full px-4 py-2.5 text-left text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600">
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login"
                  className="hidden text-[15px] font-medium text-secondary transition-colors hover:text-primary sm:inline-flex">
                  Login
                </Link>
                <Link href="/signup"
                  className="hidden items-center justify-center rounded-md bg-primary px-5 py-2 text-[14px] font-semibold text-white transition-colors hover:bg-primary/90 sm:inline-flex">
                  Create a free account
                </Link>
              </>
            )}

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => { setUserMenuOpen(false); setMobileMenuOpen(true); }}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-secondary lg:hidden"
              aria-label="Open menu"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile drawer ── */}
      <div
        className={`fixed inset-0 z-60 lg:hidden ${mobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!mobileMenuOpen}
      >
        <button
          type="button"
          className={`absolute inset-0 bg-black/40 transition-opacity ${mobileMenuOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close menu"
        />
        <aside
          className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white px-6 py-6 shadow-2xl transition-transform duration-300 ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="mb-8 flex items-center justify-between">
            <span className="text-sm font-bold uppercase tracking-widest text-slate-400">Menu</span>
            <button type="button" onClick={() => setMobileMenuOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200"
              aria-label="Close menu">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="flex max-h-[65vh] flex-col gap-0.5 overflow-y-auto">
            {navItems.map((item) =>
              item.mega ? (
                <div key={item.label}>
                  {/* Accordion toggle */}
                  <button
                    type="button"
                    onClick={() => setProductMobileOpen((v) => !v)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold text-secondary hover:bg-slate-50"
                  >
                    {item.label}
                    <ChevronDown
                      className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${productMobileOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {/* Accordion body */}
                  <div className={`overflow-hidden transition-all duration-200 ${productMobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                    <div className="mt-1 rounded-xl border border-slate-100 bg-[#f8fafc] p-3">
                      {/* Left items */}
                      <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                        {item.mega.left.heading}
                      </p>
                      {item.mega.left.items.map((sub) => (
                        <Link key={sub.label} href={sub.href} onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium text-slate-700 hover:bg-primary/5 hover:text-primary">
                          <span className="text-primary">{sub.icon}</span>
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link key={item.label} href={item.href} onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-secondary hover:bg-slate-50">
                  {item.label}
                </Link>
              )
            )}
          </div>

          {!user && !loading && (
            <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-secondary">
                Login
              </Link>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-white">
                Create a free account
              </Link>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
