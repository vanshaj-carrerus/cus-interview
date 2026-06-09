"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { getSearchRedirectUrl, getSearchSuggestions } from "@/lib/search-utils";
import { motion, AnimatePresence, Variants } from "framer-motion";



function CompanyLogo({ name, style }: { name: string; style: string }) {
  // if (name === "Goldman Sachs") {
  //   return (
  //     <div className="flex flex-col items-start opacity-50 hover:opacity-100 transition-opacity">
  //       <span className={style}>Goldman</span>
  //       <span className={style}>Sachs</span>
  //     </div>
  //   );
  // }
  return <span className={`${style}  opacity-50 hover:opacity-100 transition-all cursor-default  `}>{name}</span>;
}

const containerVariants: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const charVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: [0, 1, 1, 0],
    y: [15, 0, 0, 15],
    transition: {
      duration: 3,
      times: [0, 0.15, 0.85, 1],
      ease: "easeInOut",
      repeat: Infinity,
      repeatDelay: 0.2,
    },
  },
};

export default function CusInterviewHero() {
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();
  
  const suggestions = getSearchSuggestions(searchValue);

  useEffect(() => {
    const handleScroll = () => {
      setScrolledPastHero(window.scrollY > 500);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = () => {
    if (searchValue.trim()) {
      router.push(getSearchRedirectUrl(searchValue));
    }
  };

  return (
    <div className="relative bg-white overflow-hidden pb-1">
      {/* Background Elements - Adapted for Centered Layout */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] md:w-full h-[600px] bg-gradient-to-b from-primary/5 via-primary/5 to-transparent z-0 rounded-b-[100%]" />
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[120px] z-0" />

      {/* Floating Language Icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10">
        {/* React */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[8%] top-[15%] w-14 h-14 hidden md:block"
        >
          <svg viewBox="0 0 841.9 738.9" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#00d8ff] opacity-25 hover:opacity-60 transition-opacity">
            <ellipse cx="420.9" cy="369.5" rx="210" ry="360" stroke="currentColor" strokeWidth="20" transform="rotate(30 420.9 369.5)" />
            <ellipse cx="420.9" cy="369.5" rx="210" ry="360" stroke="currentColor" strokeWidth="20" transform="rotate(90 420.9 369.5)" />
            <ellipse cx="420.9" cy="369.5" rx="210" ry="360" stroke="currentColor" strokeWidth="20" transform="rotate(150 420.9 369.5)" />
            <circle cx="420.9" cy="369.5" r="45" fill="currentColor" />
          </svg>
        </motion.div>

        {/* Python */}
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -8, 8, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="absolute right-[8%] top-[18%] w-14 h-14 hidden md:block"
        >
          <svg viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-20 hover:opacity-50 transition-opacity">
            <path d="M55 2C41.7 2 30.5 8.9 30.5 22.3V31.2H56.5V34.5H20.1C8.9 34.5 2 41.7 2 55C2 68.3 8.9 75.5 20.1 75.5H29.1V66.6C29.1 53.2 40.3 46.3 53.6 46.3H79.9C91.1 46.3 98 39.1 98 25.8C98 12.5 91.1 2 79.9 2H55Z" fill="#38bdf8" />
            <path d="M55 108C68.3 108 79.5 101.1 79.5 87.7V78.8H53.5V75.5H89.9C101.1 75.5 108 68.3 108 55C108 41.7 101.1 34.5 89.9 34.5H80.9V43.4C80.9 56.8 69.7 63.7 56.4 63.7H30.1C18.9 63.7 12 70.9 12 84.2C12 97.5 18.9 108 30.1 108H55Z" fill="#facc15" />
          </svg>
        </motion.div>

        {/* JavaScript */}
        <motion.div
          animate={{
            y: [0, -18, 0],
            rotate: [0, -12, 12, 0],
          }}
          transition={{
            duration: 5.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute left-[12%] top-[55%] w-12 h-12 hidden md:block"
        >
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-20 hover:opacity-55 transition-opacity">
            <rect width="100" height="100" rx="12" fill="#f7df1e" />
            <path d="M72 70C72 75.2 68 79 61.5 79C55.6 79 52 75.5 52 70.8H58C58 73.2 59.5 74.5 61.5 74.5C63.5 74.5 65 73.2 65 71C65 65.5 52 66.8 52 57.5C52 52.8 55.8 49.5 61.2 49.5C66.8 49.5 70 52.8 70 57.2H64C64 54.8 62.8 53.8 61.2 53.8C59.5 53.8 58.2 54.8 58.2 56.8C58.2 61.8 72 60.5 72 70ZM47 50V71C47 76 44 79 38 79C35.5 79 33.2 78 31.8 76L34.5 72.2C35.5 73.2 36.8 74 38 74C40 74 41 72.8 41 70.8V50H47Z" fill="#000000" />
          </svg>
        </motion.div>

        {/* Rust */}
        <motion.div
          animate={{
            y: [0, 15, 0],
            rotate: [0, 15, -15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
          className="absolute right-[14%] top-[50%] w-14 h-14 hidden md:block"
        >
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#f44336] opacity-20 hover:opacity-55 transition-opacity">
            <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="8" strokeDasharray="12 6" />
            <circle cx="50" cy="50" r="24" stroke="currentColor" strokeWidth="4" />
            <path d="M50 15V32M50 68V85M15 50H32M68 50H85M25 25L37 37M63 63L75 75M75 25L63 37M37 63L25 75" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
            <text x="50" y="56" fill="currentColor" fontSize="18" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">R</text>
          </svg>
        </motion.div>
      </div>

      {/* ── HERO CONTENT (CENTERED) ── */}
      <main className="relative md:pt-20 z-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">

          {/* Top Pill */}
          {/* <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full mb-8">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-primary text-[10px] font-black uppercase tracking-widest">
              Global Staffing & Coaching
            </span>
          </div> */}

          {/* Main Headline */}
          <h4 className="font-black text-secondary mt-15 leading-[1.55] tracking-tight mb-10 max-w-6xl mx-auto">
            <span className="block text-3xl  sm:text-4xl md:text-5xl lg:text-6xl">
              Build Your Dream Career with
            </span>
            <motion.span
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl mt-4 bg-gradient-to-r from-[#38bdf8] to-[#f472b6] bg-clip-text text-transparent pb-1"
            >
              {"CUS.".split("").map((char, i) => (
                <motion.span
                  key={`line2-char-${i}`}
                  variants={charVariants}
                  className="inline-block"
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.span>
          </h4>

          {/* Hero Search Bar & Popular Searches */}
          <div className="w-full max-w-2xl mx-auto mb-12 relative px-4 z-50">
            <AnimatePresence>
              {!scrolledPastHero && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full flex flex-col items-center"
                >
                  {/* Search Bar Input */}
                  <motion.div
                    layoutId="search-bar-shared"
                    className={`relative flex items-center w-full p-[2.5px] rounded-full transition-all duration-300 ${isFocused
                        ? "bg-slate-900 shadow-[0_20px_40px_-5px_rgba(15,23,42,0.15)] scale-[1.01]"
                        : "bg-slate-900/15 hover:bg-slate-900/25 shadow-[0_15px_30px_-5px_rgba(31,61,143,0.05)]"
                      }`}
                  >
                    <div className="relative flex items-center w-full bg-white rounded-full">
                      <Search
                        className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${isFocused ? "text-[#38bdf8]" : "text-slate-400"
                          }`}
                      />
                      <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSearch();
                        }}
                        placeholder="Search Languages, Practice Problems..."
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                        className="w-full pl-13 pr-28 py-4.5 text-base text-slate-800 placeholder:text-slate-400 bg-transparent rounded-full focus:outline-none"
                      />
                      <button 
                        onClick={handleSearch}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-black uppercase tracking-widest rounded-full cursor-pointer hover:shadow-lg active:scale-95 transition-all z-10"
                      >
                        Search
                      </button>

                      {/* Autocomplete Dropdown */}
                      <AnimatePresence>
                        {isFocused && searchValue && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-[110%] left-0 right-0 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[100] flex flex-col text-left"
                          >
                            {suggestions.length > 0 ? (
                              <div className="flex flex-col py-2 max-h-[300px] overflow-y-auto">
                                {suggestions.map((s, i) => (
                                  <Link key={i} href={s.url} className="px-6 py-3 hover:bg-slate-50 flex items-center gap-3 group">
                                    <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-500 px-2 py-1 rounded group-hover:bg-[#38bdf8]/10 group-hover:text-[#38bdf8] transition-colors">{s.type}</span>
                                    <span className="text-base font-semibold text-slate-700 group-hover:text-slate-900 transition-colors truncate">{s.title}</span>
                                  </Link>
                                ))}
                              </div>
                            ) : (
                              <div className="px-6 py-4 text-sm text-slate-500 font-medium">
                                Press Enter to search for "{searchValue}"
                              </div>
                            )}
                            <Link href="/problems/courses" className="border-t border-slate-100 px-6 py-4 bg-slate-50 hover:bg-[#38bdf8]/5 text-sm font-black tracking-widest uppercase text-[#38bdf8] flex justify-between items-center transition-colors">
                              View all languages <span>→</span>
                            </Link>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>

                  {/* Popular Searches */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.1, duration: 0.2 }}
                    className="flex items-center justify-center gap-2.5 mt-4 text-[11px] text-secondary/65 flex-wrap"
                  >
                    <span className="font-semibold text-secondary/40">Popular:</span>
                    <Link href="/problems" className="hover:text-primary transition-all duration-200 hover:underline">Practice Problems</Link>
                    <span className="text-secondary/20">•</span>
                    <Link href="/mock-interviews/ai-mock" className="hover:text-primary transition-all duration-200 hover:underline">AI Mock Interviews</Link>
                    <span className="text-secondary/20">•</span>
                    <Link href="/problems/courses" className="hover:text-primary transition-all duration-200 hover:underline">Machine Learning</Link>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-5 justify-center mb-16 w-full px-4">
            <Link target="_blank" href={"http://custech.co/"} className="w-full sm:w-auto">
              <button
                className="relative w-full sm:w-auto px-10 py-4 text-[15px] text-white font-black uppercase tracking-[0.18em] rounded-2xl cursor-pointer active:scale-95 transition-all shadow-xl text-center overflow-hidden group"
                style={{
                  background: "linear-gradient(135deg, #6c5ce7 0%, #a855f7 100%)",
                  boxShadow: "0 8px 30px rgba(108, 92, 231, 0.45)",
                }}
              >
                {/* Animated shimmer overlay */}
                <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none" />
                {/* Pulse ring */}
                <span className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                ></span>
                Apply for Jobs
              </button>
            </Link>
          </div>



        </div>
      </main>
    </div>
  );
}