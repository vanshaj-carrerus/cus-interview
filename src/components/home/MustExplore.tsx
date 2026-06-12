"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const exploreItems = [
  {
    title: "Practice Problems",
    href: "/problems",
    bg: "#FFFFFF",
    arrowBg: "#0EA5E9",
    border: "#E5E7EB",
  },
  {
    title: "Programming Languages",
    href: "/problems/courses",
    bg: "#FFFFFF",
    arrowBg: "#0EA5E9",
    border: "#E5E7EB",
  },
  {
    title: "Compiler",
    href: "/compiler",
    bg: "#FFFFFF",
    arrowBg: "#0EA5E9",
    border: "#E5E7EB",
  },
  {
    title: " Interviews",
    href: "/mock-interviews",
    bg: "#FFFFFF",
    arrowBg: "#0EA5E9",
    border: "#E5E7EB",
  },
];

export default function MustExplore() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      {/* Heading */}
      <h2 className="text-xl font-bold text-slate-800 mb-5">Must Explore</h2>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {exploreItems.map((item, i) => (
          <Link
            key={i}
            href={item.href}
            className="group relative flex flex-col justify-between rounded-2xl p-6 min-h-[130px]"
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
                className="w-8 h-8 rounded-full flex items-center justify-center"
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
