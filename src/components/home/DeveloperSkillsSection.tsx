"use client";

import Link from "next/link";
import Image from "next/image";

const FEATURES = [
  {
    label: "CUS INTERVIEW COMMUNITY",
    title: "Prepare for your dream job",
    description:
      "Join a growing community of developers who certify their skills, practice interviewing, and discover relevant roles — with structured roadmaps and progress tracking built for serious candidates.",
    href: "/problems",
    image: "/deshboard-cusinterview.png",
    imageLeft: false,
  },
  {
    label: "PRACTICE & LEARN",
    title: "Accelerate with fast-track courses",
    description:
      "Industry-ready programming language courses and career tracks — from Python to Java — designed to get you interview-ready faster with hands-on projects and real-world problems.",
    href: "/problems/courses",
    image: "/practice-page.png",
    imageLeft: true,
  },
  {
    label: "RESUME ANALYZER",
    title: "Optimize your resume for ATS and recruiters",
    description:
      "ATS scoring, keyword gaps, and AI-powered tips — upload a PDF or DOCX to get instant feedback and actionable improvements that help you stand out.",
    href: "/resume-analyzer",
    image: "/resume-analyzer.png",
    imageLeft: false,
  },
];

export default function DeveloperSkillsSection() {
  return (
    <section className="relative overflow-hidden bg-[#fcfcfb] py-20 md:py-28">
      {/* Soft uneven pastel blobs — lighter wash */}
      <div
        className="pointer-events-none absolute -right-20 -top-10 h-[32rem] w-[32rem] rounded-full bg-[#c4b5fd]/15 blur-[110px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-[-8rem] top-[8%] h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-[110px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-[35%] top-[18%] h-72 w-[28rem] rounded-full bg-sky-100/40 blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-[5%] top-[42%] h-[26rem] w-[26rem] rounded-full bg-[#93c5fd]/18 blur-[110px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-[-4rem] top-[55%] h-80 w-80 rounded-full bg-[#fef3c7]/30 blur-[110px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-[8%] left-[40%] h-96 w-96 rounded-full bg-[#cffafe]/25 blur-[120px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-10 bottom-0 h-[28rem] w-[28rem] rounded-full bg-[#fecdd3]/15 blur-[110px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70 blur-[90px]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <h2 className="mb-16 text-center text-3xl font-semibold tracking-tight text-secondary md:mb-20 md:text-4xl">
          The Developer Skills Platform
        </h2>

        <div className="flex flex-col gap-24 md:gap-32">
          {FEATURES.map((feature) => (
            <div
              key={feature.label}
              className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16"
            >
              <div className={feature.imageLeft ? "lg:order-2" : ""}>
                <span className="inline-block rounded-full bg-secondary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                  {feature.label}
                </span>
                <h3 className="mt-5 text-2xl font-bold leading-snug tracking-tight text-secondary md:text-[1.75rem]">
                  {feature.title}
                </h3>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-slate-600">
                  {feature.description}
                </p>
              </div>

              <div
                className={`relative ${feature.imageLeft ? "lg:order-1" : ""}`}
              >
                <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.1)]">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    width={800}
                    height={560}
                    className="h-auto w-full object-contain"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
