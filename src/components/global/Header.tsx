"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";

export default function Header() {
  const { user, loading, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "py-3 bg-white/80 backdrop-blur-xl shadow-sm"
          : "py-5 bg-transparent"
      }`}
    >
      <div className=" max-w-7xl md:container! mx-auto px-6 flex items-center justify-between">
        {/* LOGO */}
        <Link href={"/"}>
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
              <span className="text-white font-black text-xl italic uppercase font-mono">
                C
              </span>
            </div>
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
          {[
            { label: "Practice", href: "/practice" },
            { label: "Resources", href: "#" },
            { label: "Mock Interviews", href: "#" },
          ].map((item) => (
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
        <div className="flex items-center gap-4 sm:gap-6">
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
                className="px-5 py-2.5 bg-secondary text-white font-black text-[10px] uppercase tracking-[0.15em] rounded-xl shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 inline-block text-center"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
