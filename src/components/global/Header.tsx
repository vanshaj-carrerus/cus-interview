"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { UserRound, Search, ChevronDown } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getSearchRedirectUrl, getSearchSuggestions } from "@/lib/search-utils";

export default function Header() {
  const { user, loading, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const [showNavbarSearch, setShowNavbarSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const suggestions = getSearchSuggestions(searchValue);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchValue.trim()) {
      router.push(getSearchRedirectUrl(searchValue));
    }
  };

  const navItems = [
    {
      label: "Practice Problems",
      href: "/problems",
      items: [
        { label: "DSA Roadmaps", href: "/problems" },
        { label: "Core CS Subjects", href: "/practice" },
        { label: "All Problems", href: "/problems" },
      ],
    },
    {
      label: "Languages",
      href: "/problems/courses",
      accent: "#22c55e",
      items: [
        { label: "Python Mastery", href: "problems/courses/python-mastery" },
        { label: "HTML Mastery", href: "/problems/courses/html-mastery" },
        { label: "CSS Mastery", href: "/problems/courses/css-mastery" },
        { label: "Java Mastery", href: "/problems/courses/java-mastery" },
        { label: "C# Mastery", href: "/problems/courses/csharp-mastery" },
        { label: "View All →", href: "/problems/courses" },
      ],
    },
    {
      label: "Mock Interviews",
      href: "/mock-interviews",
      items: [
        { label: "AI Mock Interview", href: "/mock-interviews/ai-mock" },
        { label: "Interview History", href: "/mock-interviews" },
        { label: "Prep Dashboard", href: "/mock-interviews" },
      ],
    },
    {
      label: "Compiler",
      href: "/compiler",
      items: [
        { label: "Code Playground", href: "/compiler" },
        { label: "Interview Editor", href: "/compiler" },
      ],
    },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (pathname !== "/") {
      setShowNavbarSearch(true);
      return;
    }

    const handleScroll = () => {
      setShowNavbarSearch(window.scrollY > 500);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? "py-3 bg-white/80 backdrop-blur-xl shadow-sm"
          : "py-5 bg-transparent"
          }`}
      >
        <div className="max-w-7xl md:container! mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6 flex-1">
            {/* LOGO */}
            <Link href={"/"}>
              <div className="flex items-center gap-2 group cursor-pointer shrink-0">
                <Image
                  src="/cus-logo-1.png"
                  alt="CUS"
                  width={105}
                  height={125}
                  loading="lazy"
                />
              </div>
            </Link>

            {/* SEARCH BAR */}
            <div className="hidden sm:flex items-center h-[46px] relative shrink-0">
              <AnimatePresence>
                {showNavbarSearch && (
                  <motion.div
                    layoutId="search-bar-shared"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 220 }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center relative h-[38px] w-[220px] shrink-0 mt-[4px] bg-white border border-slate-200 hover:border-slate-300 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 rounded-full shadow-sm transition-all duration-300"
                  >
                    <div className="relative flex items-center w-full rounded-full">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                        className="w-full pl-10 pr-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 bg-transparent rounded-full focus:outline-none transition-all"
                      />
                    </div>
                    {/* Autocomplete Dropdown */}
                    <AnimatePresence>
                      {isSearchFocused && searchValue && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-[120%] left-0 w-[250px] bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50 flex flex-col"
                        >
                          {suggestions.length > 0 ? (
                            <div className="flex flex-col py-2 max-h-[300px] overflow-y-auto">
                              {suggestions.map((s, i) => (
                                <Link key={i} href={s.url} className="px-4 py-2 hover:bg-slate-50 flex items-center gap-2 group">
                                  <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">{s.type}</span>
                                  <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors truncate">{s.title}</span>
                                </Link>
                              ))}
                            </div>
                          ) : (
                            <div className="px-4 py-3 text-xs text-slate-500 font-medium text-center">
                              Press Enter to search for "{searchValue}"
                            </div>
                          )}
                          <Link href="/problems/courses" className="border-t border-slate-100 px-4 py-3 bg-slate-50 hover:bg-indigo-50 text-xs font-black tracking-widest uppercase text-indigo-600 flex justify-between items-center transition-colors">
                            View all languages <span>→</span>
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* NAVIGATION */}
            <div className="hidden lg:flex items-center gap-8 xl:gap-12 ml-20">
              {navItems.map((item) => (
                <div key={item.label} className="relative group">
                  <button className="flex items-center gap-1 text-slate-850 text-black hover:text-primary font-bold text-[14px] transition-colors py-2 cursor-pointer">
                    {item.label}
                    <ChevronDown className="w-3.5 h-3.5 text-slate-700 dark:text-slate-400 group-hover:text-primary transition-all duration-200 group-hover:rotate-180" />
                  </button>
                  <div className="absolute top-full left-0 z-50 mt-1 hidden group-hover:block w-48 rounded-xl border border-secondary/10 bg-white py-2 shadow-xl">
                    {item.items.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        className="block px-4 py-2 text-xs font-semibold text-secondary hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-3 sm:gap-6">
            {loading ? (
              <span className="hidden sm:block text-secondary/40 text-[10px] font-black uppercase tracking-widest">
                …
              </span>
            ) : user ? (
              <div className="relative isolate" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((open) => !open)}
                  className="inline-flex cursor-pointer items-center justify-center w-10 h-10 rounded-xl border border-secondary/15 bg-white/90 text-secondary hover:border-primary/40 hover:text-primary transition-colors shadow-sm"
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
                    className="absolute right-0 top-full z-50 mt-2 w-56 sm:w-60 rounded-2xl border border-secondary/10 bg-white py-2 shadow-xl ring-1 ring-secondary/5"
                  >
                    <div className="px-4 py-3 border-b border-secondary/10">
                      <p className="text-[10px] font-black uppercase tracking-widest text-secondary/45">
                        Signed in
                      </p>
                      {user.name ? (
                        <>
                          <p className="text-sm font-black text-secondary truncate mt-1">{user.name}</p>
                          <p className="text-xs text-secondary/55 truncate mt-0.5">{user.email}</p>
                        </>
                      ) : (
                        <p className="text-sm font-bold text-secondary truncate mt-1">{user.email}</p>
                      )}
                    </div>
                    <Link
                      href="/profile"
                      role="menuitem"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm font-black text-secondary uppercase tracking-widest hover:bg-primary/10 hover:text-primary transition-colors"
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
                      className="w-full text-left px-4 py-2.5 text-sm font-black text-secondary uppercase tracking-widest hover:bg-primary/10 hover:text-primary transition-colors"
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
                  className="hidden font-semibold tracking-wide sm:block text-secondary font-black text-[14px] uppercase tracking-widest hover:text-primary transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/mock-interviews"
                  className="hidden sm:block font-semibold tracking-wide px-6 py-2.5 text-white font-black text-[13px] uppercase tracking-[0.15em] rounded-xl shadow-lg hover:-translate-y-0.5 transition-all active:scale-95 text-center"
                  style={{
                    background: "linear-gradient(135deg, #6c5ce7 0%, #a855f7 100%)",
                    boxShadow: "0 4px 15px rgba(108, 92, 231, 0.35)",
                  }}
                >
                  🎯 Mock Interview
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
