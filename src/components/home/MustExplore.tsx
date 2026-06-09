"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const exploreItems = [
  {
    title: "Practice Problems",
    href: "/problems",
    bg: "#EEF2FF",
    arrowBg: "#6c5ce7",
    border: "#c7d2fe",
  },
  
  {
    title: "Languages",
    href: "/problems/courses",
    bg: "#F0FDF4",
    arrowBg: "#22c55e",
    border: "#bbf7d0",
  },
  {
    title: "Compiler",
    href: "/compiler",
    bg: "#FDF4FF",
    arrowBg: "#a855f7",
    border: "#e9d5ff",
  },
   {
    title: " Interviews",
    href: "/mock-interviews",
     bg: "#FFF7ED",
   arrowBg: "#e67e22",
    border: "#fed7aa",
  },
];

export default function MustExplore() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      {/* Heading */}
      <h2 className="text-xl font-bold text-slate-800 mb-5">Must Explore</h2>

      {/* Cards grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {exploreItems.map((item, i) => (
          <Link
            key={i}
            href={item.href}
            className="group relative flex flex-col justify-between rounded-2xl p-6 min-h-[130px] transition-all duration-300 hover:scale-[1.03] hover:shadow-lg"
            style={{
              background: item.bg,
              border: `1px solid ${item.border}`,
            }}
          >
            {/* Title */}
            <span className="text-slate-800 font-semibold text-[15px] leading-snug pr-4">
              {item.title}
            </span>

            {/* Arrow bottom-right */}
            <div className="flex justify-end mt-4">
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:translate-x-1"
                style={{ background: item.arrowBg }}
              >
                <ArrowRight size={15} className="text-white" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
