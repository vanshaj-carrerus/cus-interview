"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { UserRound, ChevronDown } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import Logo from "@/components/global/Logo";

export default function Header() {
  const { user, loading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const navItems: {
    label: string;
    href: string;
    items?: { label: string; href: string }[];
  }[] = [
    {
      label: "Practice",
      href: "/problems",
    },
    {
      label: "Courses",
      href: "/problems/courses",
      items: [
        { label: "Python Mastery", href: "/problems/courses/python-mastery" },
        { label: "HTML Mastery", href: "/problems/courses/html-mastery" },
        { label: "CSS Mastery", href: "/problems/courses/css-mastery" },
        { label: "Java Mastery", href: "/problems/courses/java-mastery" },
        { label: "C# Mastery", href: "/problems/courses/csharp-mastery" },
        { label: "View All", href: "/problems/courses" },
      ],
    },
    {
      label: "Mock Interviews",
      href: "/mock-interviews",
    },
    {
      label: "Compiler",
      href: "/compiler",
    },
    {
      label: "Resources",
      href: "/resume-analyzer",
    },
    {
      label: "Pricing",
      href: "/pricing",
    },
  ];

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!userMenuOpen) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [userMenuOpen]);

  useEffect(() => {
    if (!userMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setUserMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [userMenuOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-100 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6 lg:px-8">
          <div className="flex shrink-0 items-center">
            <Logo priority width={120} height={48} />
          </div>

          <nav className="hidden flex-1 items-center justify-center gap-8 lg:flex">
            {navItems.map((item) =>
              item.items ? (
                <div key={item.label} className="relative group">
                  <button
                    type="button"
                    className="flex cursor-pointer items-center gap-1 py-2 text-[15px] font-medium text-secondary transition-colors hover:text-primary"
                  >
                    {item.label}
                    <ChevronDown className="h-4 w-4 text-slate-400 transition-transform group-hover:rotate-180" />
                  </button>
                  <div className="absolute top-full left-0 z-50 hidden pt-2 group-hover:block">
                    <div className="w-48 rounded-xl border border-slate-100 bg-white py-2 shadow-xl">
                      {item.items.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          className="block px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-primary/5 hover:text-primary"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="py-2 text-[15px] font-medium text-secondary transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="flex items-center justify-end gap-4">
            {loading ? (
              <span className="hidden text-sm text-slate-400 sm:block">…</span>
            ) : user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((open) => !open)}
                  className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:border-primary/30 hover:text-primary"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="menu"
                >
                  <UserRound className="h-4 w-4" strokeWidth={2} />
                  <span className="sr-only">Account menu</span>
                </button>
                {userMenuOpen ? (
                  <div
                    role="menu"
                    className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-slate-100 bg-white py-2 shadow-xl"
                  >
                    <div className="border-b border-slate-100 px-4 py-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Signed in
                      </p>
                      <p className="mt-1 truncate text-sm font-semibold text-secondary">
                        {user.name ?? user.email}
                      </p>
                    </div>
                    <Link
                      href="/profile"
                      role="menuitem"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-primary/5 hover:text-primary"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/dashboard"
                      role="menuitem"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-primary/5 hover:text-primary"
                    >
                      Dashboard
                    </Link>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setUserMenuOpen(false);
                        void logout();
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600"
                    >
                      Log out
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden text-[15px] font-medium text-secondary transition-colors hover:text-primary sm:inline-flex"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="hidden items-center justify-center rounded-md bg-primary px-5 py-2 text-[14px] font-semibold text-white transition-colors hover:bg-primary/90 sm:inline-flex"
                >
                  Create a free account
                </Link>
              </>
            )}

            <button
              type="button"
              onClick={() => {
                setUserMenuOpen(false);
                setMobileMenuOpen(true);
              }}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-secondary lg:hidden"
              aria-label="Open menu"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

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
            <span className="text-sm font-bold uppercase tracking-widest text-slate-400">
              Menu
            </span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200"
              aria-label="Close menu"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div className="flex max-h-[60vh] flex-col gap-1 overflow-y-auto">
            {navItems.map((item) =>
              item.items ? (
                <div key={item.label} className="space-y-1 py-2">
                  <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {item.label}
                  </p>
                  {item.items.map((sub) => (
                    <Link
                      key={sub.label}
                      href={sub.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm font-semibold text-secondary hover:bg-slate-50"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-secondary hover:bg-slate-50"
                >
                  {item.label}
                </Link>
              ),
            )}
          </div>

          {!user && !loading ? (
            <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-secondary"
              >
                Login
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-white"
              >
                Create a free account
              </Link>
            </div>
          ) : null}
        </aside>
      </div>
    </>
  );
}
