"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { UserRound, Search, ChevronDown } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const { user, loading, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);


  const navItems: { label: string; href: string; accent?: string; items?: { label: string; href: string; }[] }[] = [
    {
      label: "Practice Problems",
      href: "/problems",
    },
    {
      label: "Programming Languages",
      href: "/problems/courses",
      accent: "#22c55e",
      items: [
        { label: "Python Mastery", href: "problems/courses/python-mastery" },
        { label: "HTML Mastery", href: "/problems/courses/html-mastery" },
        { label: "CSS Mastery", href: "/problems/courses/css-mastery" },
        { label: "Java Mastery", href: "/problems/courses/java-mastery" },
        { label: "C# Mastery", href: "/problems/courses/csharp-mastery" },
        { label: "View All ", href: "/problems/courses" },
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
      label: "Pricing",
      href: "/pricing",
    },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!userMenuOpen) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
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
      <nav
        className={`fixed top-4 left-0 right-0 z-50 px-4 sm:px-8 lg:px-12 flex justify-center pointer-events-none transition-all duration-300 ${scrolled ? "top-2" : "top-4"}`}
      >
        <div
          className={`pointer-events-auto w-full flex items-center justify-between px-6 py-5 rounded-full border border-slate-100 bg-white transition-all duration-300 ${scrolled ? "shadow-md bg-white/95 backdrop-blur-xl" : "shadow-sm"}`}
        >
          <div className="flex items-center">
            {/* LOGO */}
            <Link href={"/"}>
              <div className="flex items-center gap-2 group cursor-pointer shrink-0">
                <Image
                  src="/cus-logo-1.png"
                  alt="CUS"
                  width={180}
                  height={50}
                  className="h-12 w-auto object-contain"
                  loading="lazy"
                />
              </div>
            </Link>
          </div>

          {/* NAVIGATION */}
          <div className="hidden lg:flex flex-1 items-center justify-center gap-6 xl:gap-10">
            {navItems.map((item) => (
              item.items ? (
                <div key={item.label} className="relative group">
                  <button className="flex items-center gap-1.5 text-slate-800 hover:text-sky-500 font-semibold text-[15px] transition-colors py-2 cursor-pointer">
                    {item.label}
                    <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-sky-500 transition-all duration-200 group-hover:rotate-180" />
                  </button>
                  <div className="absolute top-full left-0 z-50 hidden group-hover:block pt-2">
                    <div className="w-48 rounded-2xl border border-slate-100 bg-white py-2 shadow-xl">
                      {item.items.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          className="block px-4 py-2 text-sm font-medium text-slate-600 hover:bg-sky-50 hover:text-sky-500 transition-colors"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link key={item.label} href={item.href} className="text-slate-800 hover:text-sky-500 font-semibold text-[15px] transition-colors py-2">
                  {item.label}
                </Link>
              )
            ))}
          </div>

          {/* ACTIONS */}
          <div className="flex items-center justify-end gap-5">
            {loading ? (
              <span className="hidden sm:block text-slate-400 text-sm font-semibold">
                …
              </span>
            ) : user ? (
              <div className="relative isolate" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((open) => !open)}
                  className="inline-flex cursor-pointer items-center justify-center w-10 h-10 rounded-full border border-slate-200 bg-slate-50 text-slate-600 hover:border-sky-200 hover:text-sky-400 hover:bg-sky-50/50 transition-colors shadow-sm"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="menu"
                  aria-controls="header-user-menu"
                >
                  <UserRound className="w-5 h-5" strokeWidth={2} aria-hidden />
                  <span className="sr-only">Account menu</span>
                </button>
                {userMenuOpen ? (
                  <div
                    id="header-user-menu"
                    role="menu"
                    aria-orientation="vertical"
                    className="absolute right-0 top-full z-50 mt-2 w-56 sm:w-60 rounded-2xl border border-slate-100 bg-white py-2 shadow-xl ring-1 ring-slate-900/5"
                  >
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Signed in
                      </p>
                      {user.name ? (
                        <>
                          <p className="text-sm font-bold text-slate-800 truncate mt-1">{user.name}</p>
                          <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
                        </>
                      ) : (
                        <p className="text-sm font-bold text-slate-800 truncate mt-1">{user.email}</p>
                      )}
                    </div>
                    <Link
                      href="/profile"
                      role="menuitem"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-sky-50 hover:text-sky-600 transition-colors"
                    >
                      Profile
                    </Link>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setUserMenuOpen(false);
                        void logout();
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
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
                  className="hidden sm:inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#4ba3e3] hover:bg-sky-500 text-white text-[15px] font-semibold shadow-sm shadow-sky-200 transition-all"
                >
                  Get Started
                </Link>
              </>
            )}

            <button
              type="button"
              onClick={() => {
                setUserMenuOpen(false);
                setMobileMenuOpen(true);
              }}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-secondary/20 text-secondary hover:text-primary hover:border-primary/40 transition-colors"
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-sidebar-menu"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" aria-hidden>
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
      </nav>

      <div
        className={`lg:hidden fixed inset-0 z-60 transition ${mobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
        aria-hidden={!mobileMenuOpen}
      >
        <button
          type="button"
          className={`absolute inset-0 bg-black/40 backdrop-blur-[1px] transition-opacity ${mobileMenuOpen ? "opacity-100" : "opacity-0"
            }`}
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close menu overlay"
        />

        <aside
          id="mobile-sidebar-menu"
          className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl px-6 py-6 transition-transform duration-300 ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile menu"
        >
          <div className="flex items-center justify-between mb-8">
            <span className="text-secondary font-black text-sm uppercase tracking-widest">
              Menu
            </span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-secondary/20 text-secondary hover:text-primary hover:border-primary/40 transition-colors"
              aria-label="Close menu"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" aria-hidden>
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div className="flex flex-col gap-5 overflow-y-auto max-h-[60vh] pr-2">
            {navItems.map((item) => (
              <div key={item.label} className="space-y-1">
                {item.items ? (
                  <>
                    <p className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {item.label}
                    </p>
                    <div className="flex flex-col gap-1 pl-2">
                      {item.items.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="px-3 py-2 rounded-lg text-secondary font-extrabold text-[13px] hover:bg-secondary/5 hover:text-primary transition-colors"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 block rounded-lg text-secondary font-extrabold text-[13px] hover:bg-secondary/5 hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-secondary/10 flex flex-col gap-3">
            {loading ? (
              <span className="text-secondary/40 text-[10px] font-black uppercase tracking-widest">
                Loading...
              </span>
            ) : user ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-3 rounded-lg text-secondary font-extrabold text-xs uppercase tracking-widest hover:bg-secondary/5 hover:text-primary transition-colors"
                >
                  Profile
                </Link>
                <span className="text-secondary/80 text-sm font-bold truncate">
                  {user.name ? user.name : user.email}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    void logout();
                  }}
                  className="px-4 py-2.5 rounded-lg bg-secondary text-white font-black text-[10px] uppercase tracking-[0.15em] text-center"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-lg border border-secondary/20 text-secondary font-black text-[10px] uppercase tracking-[0.15em] text-center"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-lg bg-secondary text-white font-black text-[10px] uppercase tracking-[0.15em] text-center"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
