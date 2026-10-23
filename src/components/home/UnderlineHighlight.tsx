"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

/* Shared section-heading style for the home page */
export const SECTION_HEADING =
  "font-serif text-3xl font-normal leading-[1.15] tracking-[-0.02em] text-slate-950 md:text-[2.75rem] xl:text-[3.25rem]";

/* Phrase with a hand-drawn underline that draws in when scrolled into view */
export default function UnderlineHighlight({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-block whitespace-nowrap">
      {children}
      <svg
        className="pointer-events-none absolute -bottom-1.5 left-0 h-2.5 w-full md:-bottom-2 md:h-3"
        viewBox="0 0 300 12"
        preserveAspectRatio="none"
        aria-hidden
      >
        <motion.path
          d="M2 9 C 60 3, 140 2, 298 6"
          fill="none"
          stroke="#0ea5e9"
          strokeWidth="3"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: "easeInOut", delay: 0.2 }}
        />
      </svg>
    </span>
  );
}
