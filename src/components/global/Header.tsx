"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import Image from "next/image";

export default function Header() {
  const { user, loading, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navItems = [
    { label: "Practice", href: "/practice" },
    // { label: "Resources", href: "#" },
    { label: "Mock Interviews", href: "/mock-interviews" },
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

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "py-3 bg-white/80 backdrop-blur-xl shadow-sm"
            : "py-5 bg-transparent"
        }`}
      >
        <div className="max-w-7xl md:container! mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* LOGO */}
          <Link href={"/"}>
            <div className="flex items-center gap-2 group cursor-pointer">
              <Image src={"/favicon.png"} alt="CUS" width={35} height={35} />
              <div className="flex flex-col leading-none">
                <span className="text-secondary font-black text-xl tracking-tighter uppercase">
                  CareerUs
                </span>
                <span className="text-primary text-[8px] font-black tracking-[0.3em] uppercase">
                  Interview Solutions
                </span>
              </div>
            </div>
          </Link>

          {/* NAVIGATION */}
          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-secondary/70 hover:text-primary font-bold text-xs uppercase tracking-widest transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-3 sm:gap-6">
            {loading ? (
              <span className="hidden sm:block text-secondary/40 text-[10px] font-black uppercase tracking-widest">
                …
              </span>
            ) : user ? (
              <>
                <span className="hidden sm:block max-w-[140px] truncate text-secondary/80 text-[11px] font-bold">
                  {user.name ? user.name : user.email}
                </span>
                <button
                  type="button"
                  onClick={() => void logout()}
                  className="hidden sm:block text-secondary font-black text-[12px] uppercase tracking-widest hover:text-primary transition-colors"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:block text-secondary font-black text-[12px] uppercase tracking-widest hover:text-primary transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="hidden sm:block px-5 py-2.5 bg-secondary text-white font-black text-[10px] uppercase tracking-[0.15em] rounded-xl shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 text-center"
                >
                  Get Started
                </Link>
              </>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-secondary/20 text-secondary hover:text-primary hover:border-primary/40 transition-colors"
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
        className={`md:hidden fixed inset-0 z-60 transition ${
          mobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        <button
          type="button"
          className={`absolute inset-0 bg-black/40 backdrop-blur-[1px] transition-opacity ${
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close menu overlay"
        />

        <aside
          id="mobile-sidebar-menu"
          className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl px-6 py-6 transition-transform duration-300 ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
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

          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-3 rounded-lg text-secondary font-extrabold text-xs uppercase tracking-widest hover:bg-secondary/5 hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-secondary/10 flex flex-col gap-3">
            {loading ? (
              <span className="text-secondary/40 text-[10px] font-black uppercase tracking-widest">
                Loading...
              </span>
            ) : user ? (
              <>
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
