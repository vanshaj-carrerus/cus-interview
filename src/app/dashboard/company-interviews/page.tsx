import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Building2, Sparkles } from "lucide-react";
import { COMPANY_INTERVIEW_GUIDES } from "@/lib/dashboard/company-guides";

const companies = COMPANY_INTERVIEW_GUIDES;

const interviewTopics = [
  {
    title: "Data Structures & Algorithms",
    description: "Arrays, trees, graphs, dynamic programming — the core of technical interviews.",
    href: "/dashboard/practice-problems",
    tag: "DSA",
  },
  {
    title: "System Design",
    description: "Scalability, databases, caching, and architecture patterns for senior roles.",
    href: "/dashboard/programming-languages",
    tag: "Design",
  },
  {
    title: "Behavioral & HR Round",
    description: "STAR method, leadership stories, and culture-fit questions.",
    href: "/dashboard/ai-mock-interview",
    tag: "Behavioral",
  },
  {
    title: "Language-Specific Questions",
    description: "Java, Python, JavaScript deep dives with real interview patterns.",
    href: "/dashboard/programming-languages",
    tag: "Languages",
  },
];

export default function DashboardCompanyInterviewsPage() {
  return (
    <div className="space-y-8">
      <header>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
          <Building2 className="h-3.5 w-3.5 text-primary" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
            Interview Prep
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-secondary sm:text-3xl">
          Company Interview Questions
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-secondary/60">
          Prepare with real company interview patterns. Our candidates have cracked interviews at
          top tech companies worldwide.
        </p>
      </header>

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-secondary/50">
          Our candidates work at
        </h2>
        <div className="flex flex-wrap items-center gap-6 rounded-xl border border-primary/15 bg-white p-6">
          {companies.map((company) => (
            <div key={company.name} className="relative h-8 w-24 opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0">
              <Image src={company.src} alt={company.name} fill className="object-contain" />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-bold text-secondary">Interview Topics</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {interviewTopics.map((topic) => (
            <Link
              key={topic.title}
              href={topic.href}
              className="group rounded-xl border border-primary/15 bg-white p-5 transition hover:border-primary/30 hover:shadow-sm"
            >
              <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                {topic.tag}
              </span>
              <h3 className="mt-2 font-semibold text-secondary group-hover:text-primary">
                {topic.title}
              </h3>
              <p className="mt-1 text-sm text-secondary/60">{topic.description}</p>
              <ArrowRight className="mt-3 h-4 w-4 text-primary opacity-0 transition group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-xl bg-gradient-to-r from-primary/10 to-sky-50 p-6">
        <div className="flex items-start gap-4">
          <Sparkles className="h-6 w-6 shrink-0 text-primary" />
          <div>
            <h3 className="font-bold text-secondary">Practice with AI Mock Interviews</h3>
            <p className="mt-1 text-sm text-secondary/60">
              Get instant AI scoring and feedback on real company-style interview questions.
            </p>
            <Link
              href="/dashboard/ai-mock-interview"
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              Start Mock Interview <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
