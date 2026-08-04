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
    image: "/Programming Languages.png",
    imageLeft: true,
  },
  {
    label: "CUS INTERVIEW ASSESS",
    title: "Assessments that ensure fairness and integrity",
    description:
      "Identify strong developers with secure take-home assessments and curated challenges across DSA, system design, and full-stack development — built for accurate, bias-free evaluation.",
    href: "/problems",
    image: "/Practice Problems.png",
    imageLeft: false,
  },
  {
    label: "CUS FOR HIRING",
    title: "AI mock interviews on demand",
    description:
      "Get an accurate sense of real interview performance with AI-powered mock sessions, live scoring, and detailed feedback — so you walk in confident on interview day.",
    href: "/mock-interviews",
    image: "/img-inter.png",
    imageLeft: true,
  },
];

export default function DeveloperSkillsSection() {
  return (
    <section className="relative overflow-hidden bg-[#faf9f7] py-20 md:py-28">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top,rgba(108,92,231,0.12),transparent_70%)]"
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
                <Link
                  href={feature.href}
                  className="mt-6 inline-flex items-center text-[15px] font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  Learn more →
                </Link>
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
