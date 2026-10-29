import { Fragment, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import HeroDashboard from "@/components/developers/HeroDashboard";
import StackedDeepDives from "@/components/developers/StackedDeepDives";
import {
  ArrowRight,
  Bot,
  Briefcase,
  Code,
  FileCheck2,
  FolderKanban,
  GraduationCap,
  Terminal,
  type LucideIcon,
} from "lucide-react";

const LOGOS = [
  { name: "Amazon", src: "/logos/amazon.png" },
  { name: "Facebook", src: "/logos/facebook.png" },
  { name: "Goldman Sachs", src: "/logos/goldman-sachs.png" },
  { name: "TCS", src: "/logos/tcs.png" },
  { name: "Accenture", src: "/logos/accenture.png" },
  { name: "HCL", src: "/logos/HCL.png" },
];

/* ─── Bento features ────────────────────────────────────────── */

/* Card illustration cropped from the design file in public/features */
function FeatureArt({
  name,
  alt,
  w,
  h,
  className = "w-[78%] max-w-[320px]",
}: {
  name: string;
  alt: string;
  w: number;
  h: number;
  className?: string;
}) {
  return (
    <Image
      src={`/features/${name}.webp`}
      alt={alt}
      width={w}
      height={h}
      sizes="(min-width: 1024px) 320px, 80vw"
      className={`h-auto ${className}`}
    />
  );
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-lg bg-white/70 px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-900/5">
      {children}
    </span>
  );
}

type BentoItem = {
  title: string;
  description: string;
  href: string;
  linkLabel: string;
  icon: LucideIcon;
  /* soft card colour + grid placement on large screens */
  bg: string;
  span: string;
  chips?: string[];
  art?: ReactNode;
};

const BENTO: BentoItem[] = [
  {
    title: "AI Mock Interview",
    description:
      "Pick your language, framework, target role and seniority. The AI calibrates difficulty and interviews you like a real panel, then scores your answers.",
    href: "/dashboard/ai-mock-interview",
    linkLabel: "Start a mock interview",
    icon: Bot,
    bg: "bg-[#fee085]",
    span: "lg:col-span-3",
    chips: ["Intern / new grad", "Junior", "Mid", "Senior"],
    art: <FeatureArt name="ai-interview" alt="AI mock interview preview" w={825} h={372} />,
  },
  {
    title: "Practice Problems",
    description:
      "119 hand-picked problems across arrays, strings, trees, stacks & queues, math and design. Filter by status and difficulty.",
    href: "/dashboard/practice-problems",
    linkLabel: "Browse problems",
    icon: Code,
    bg: "bg-[#ccdefd]",
    span: "lg:col-span-3",
    chips: ["Arrays", "Strings", "Trees", "Stack & Queue", "Math & Counting", "Design"],
    art: <FeatureArt name="practice" alt="Practice problems preview" w={843} h={348} />,
  },
  {
    title: "Languages & Quizzes",
    description: "79 mastery tracks, from Python and Java to Docker, AWS and Kubernetes.",
    href: "/dashboard/programming-languages",
    linkLabel: "Explore tracks",
    icon: GraduationCap,
    bg: "bg-[#def9ea]",
    span: "lg:col-span-2",
    art: <FeatureArt name="languages" alt="Python, Java, Docker, AWS and Kubernetes" w={540} h={290} />,
  },
  {
    title: "Online Compiler",
    description: "Write and run code in the browser. No setup, no installs.",
    href: "/dashboard/compiler",
    linkLabel: "Open compiler",
    icon: Terminal,
    bg: "bg-[#fde3e3]",
    span: "lg:col-span-2",
    art: <FeatureArt name="compiler" alt="Online compiler preview" w={520} h={302} />,
  },
  {
    title: "Resume Analyzer",
    description: "ATS score, keyword gaps and AI suggestions for your PDF or DOCX.",
    href: "/dashboard/resume-analyzer",
    linkLabel: "Analyze my resume",
    icon: FileCheck2,
    bg: "bg-[#fdf6dc]",
    span: "lg:col-span-2",
    art: <FeatureArt name="resume" alt="Resume ATS score preview" w={555} h={300} />,
  },
  {
    title: "Company Questions",
    description:
      "Real questions asked by companies, grouped so you prep for the one you're targeting.",
    href: "/dashboard/company-interviews",
    linkLabel: "See company questions",
    icon: Briefcase,
    bg: "bg-[#e8dffc]",
    span: "lg:col-span-3",
    art: <FeatureArt name="companies" alt="Company question logos" w={808} h={270} />,
  },
  {
    title: "Projects that build your portfolio",
    description:
      "100+ beginner to advanced build ideas with suggested stacks, from a Number Guessing Game to a Multi-Vendor E-Commerce Platform.",
    href: "/dashboard/projects",
    linkLabel: "Explore projects",
    icon: FolderKanban,
    bg: "bg-[#ddeefd]",
    span: "lg:col-span-3",
    art: <FeatureArt name="projects" alt="Project tech stack preview" w={890} h={170} />,
  },
];

/* ─── Role tracks (line-art illustrations) ──────────────────── */

type RoleArt = "frontend" | "backend" | "fullstack" | "mobile" | "data" | "devops";

function RoleIllustration({ art, color }: { art: RoleArt; color: string }) {
  const common = {
    fill: "none",
    stroke: color,
    strokeWidth: 3,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <svg viewBox="0 0 140 110" className="h-24 w-32" aria-hidden>
      {/* motion dashes */}
      <path d="M100 8h14M108 14h8M4 96h16" {...common} strokeWidth={2.5} opacity={0.6} />
      {art === "frontend" && (
        <>
          <rect x="22" y="24" width="96" height="68" rx="10" {...common} fill="#fff" fillOpacity={0.55} />
          <path d="M22 40h96" {...common} />
          <circle cx="32" cy="32" r="2" fill={color} />
          <circle cx="40" cy="32" r="2" fill={color} />
          <circle cx="48" cy="32" r="2" fill={color} />
          <path d="M56 56l-10 9 10 9M84 56l10 9-10 9M75 52l-10 26" {...common} />
        </>
      )}
      {art === "backend" && (
        <>
          <rect x="30" y="18" width="46" height="78" rx="10" {...common} fill="#fff" fillOpacity={0.55} />
          <path d="M30 44h46M30 70h46" {...common} />
          <circle cx="40" cy="31" r="2" fill={color} />
          <circle cx="48" cy="31" r="2" fill={color} />
          <circle cx="40" cy="83" r="2" fill={color} />
          <circle cx="48" cy="83" r="2" fill={color} />
          <ellipse cx="96" cy="50" rx="20" ry="7" {...common} fill="#fff" fillOpacity={0.7} />
          <path d="M76 50v32c0 4 9 7 20 7s20-3 20-7V50M76 66c0 4 9 7 20 7s20-3 20-7" {...common} />
        </>
      )}
      {art === "fullstack" && (
        <>
          <rect x="18" y="20" width="62" height="44" rx="8" {...common} fill="#fff" fillOpacity={0.55} />
          <path d="M18 32h62M32 44l-6 6 6 6M44 44l6 6-6 6" {...common} />
          <rect x="50" y="42" width="72" height="50" rx="8" {...common} fill="#fff" fillOpacity={0.8} />
          <path d="M50 54h72" {...common} />
          <circle cx="102" cy="76" r="8" {...common} />
          <path d="M102 62v4M102 86v4M88 76h4M112 76h4" {...common} />
        </>
      )}
      {art === "mobile" && (
        <>
          <rect x="28" y="12" width="46" height="84" rx="10" {...common} fill="#fff" fillOpacity={0.55} />
          <path d="M44 20h14" {...common} />
          <rect x="42" y="50" width="18" height="14" rx="3" fill={color} />
          <path d="M44 50a7 7 0 0 1 14 0M45 43l2 3M57 43l-2 3" {...common} />
          <rect x="70" y="34" width="40" height="66" rx="10" {...common} fill="#fff" fillOpacity={0.8} />
          <circle cx="90" cy="70" r="5" fill={color} />
          <path d="M92 62l3-3" {...common} />
        </>
      )}
      {art === "data" && (
        <>
          <ellipse cx="54" cy="28" rx="26" ry="9" {...common} fill="#fff" fillOpacity={0.7} />
          <path d="M28 28v52c0 5 12 9 26 9s26-4 26-9V28M28 46c0 5 12 9 26 9s26-4 26-9M28 63c0 5 12 9 26 9s26-4 26-9" {...common} />
          <rect x="72" y="56" width="46" height="40" rx="7" {...common} fill="#fff" fillOpacity={0.85} />
          <path d="M84 86V76M94 86V68M104 86V72" {...common} />
        </>
      )}
      {art === "devops" && (
        <>
          <path
            d="M38 70a16 16 0 0 1 2-32 22 22 0 0 1 42 6 14 14 0 0 1 0 26z"
            {...common}
            fill="#fff"
            fillOpacity={0.6}
          />
          <path d="M60 64V44M52 52l8-8 8 8" {...common} />
          <rect x="84" y="62" width="40" height="14" rx="5" {...common} fill="#fff" fillOpacity={0.85} />
          <rect x="84" y="80" width="40" height="14" rx="5" {...common} fill="#fff" fillOpacity={0.85} />
          <path d="M92 69h8M92 87h8" {...common} />
        </>
      )}
    </svg>
  );
}

const ROLES: { title: string; stack: string; art: RoleArt; bg: string; color: string }[] = [
  { title: "Frontend Developer", stack: "HTML · CSS · JavaScript · React · TypeScript", art: "frontend", bg: "bg-[#fee3cf]", color: "#f97316" },
  { title: "Backend Developer", stack: "Java · Spring Boot · Node.js · SQL · REST API", art: "backend", bg: "bg-[#cdf8e0]", color: "#10b981" },
  { title: "Full Stack Developer", stack: "Frontend · Backend · Git · Docker", art: "fullstack", bg: "bg-[#cfe0fe]", color: "#3b82f6" },
  { title: "Mobile Developer", stack: "Android · Flutter · React Native", art: "mobile", bg: "bg-[#e5d6fd]", color: "#9333ea" },
  { title: "Data Engineer", stack: "Python · Apache Spark · Hadoop · Big Data", art: "data", bg: "bg-[#fbefcd]", color: "#eab308" },
  { title: "DevOps & Cloud", stack: "AWS · Azure · Kubernetes · Jenkins · Linux", art: "devops", bg: "bg-[#fbd0da]", color: "#e11d48" },
];

/* ─── Page ──────────────────────────────────────────────────── */

export default function ForDevelopersPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[560px]"
          aria-hidden
          style={{
            backgroundImage: "radial-gradient(rgba(100,116,139,0.18) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage: "radial-gradient(ellipse 60% 70% at 50% 0%, black 20%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse 60% 70% at 50% 0%, black 20%, transparent 75%)",
          }}
        />
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-56 w-[36rem] -translate-x-1/2 rounded-full bg-sky-50/60 blur-3xl"
          aria-hidden
        />

        <div className="relative mx-auto max-w-6xl px-6 pt-16 text-center md:pt-20">
          <h1 className="mx-auto max-w-4xl text-4xl font-medium leading-[1.1] tracking-[-0.025em] text-slate-950 sm:text-6xl md:text-[4.25rem]">
            Practice like it&apos;s the
            <br />
            <span className="text-sky-400">real interview.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-500 md:text-lg">
            Practice problems, AI mock interviews, courses and a resume analyzer — one dashboard that takes you from
            preparing to getting hired.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-7 py-3.5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Get started — for free
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-7 py-3.5 text-[15px] font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              Discover features
            </a>
          </div>

          <div className="mx-auto mt-16 max-w-5xl">
            <HeroDashboard />
          </div>
        </div>
      </section>

      {/* Logos + statement */}
      <section className="mx-auto max-w-6xl px-6 pt-20 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
          Prepare for interviews at top companies
        </p>
        <div className="mx-auto mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="animate-company-logo-marquee flex w-max items-center hover:[animation-play-state:paused]">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex items-center gap-16 pr-16" aria-hidden={copy === 1}>
                {LOGOS.map((logo) => (
                  <span key={`${logo.name}-${copy}`} className="relative h-9 w-28 shrink-0">
                    <Image
                      src={logo.src}
                      alt={copy === 0 ? logo.name : ""}
                      fill
                      sizes="112px"
                      className="object-contain opacity-70 grayscale brightness-0"
                    />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-24 text-center md:py-32">
        <p className="text-3xl font-medium leading-[1.1] tracking-[-0.025em] text-slate-950 sm:text-5xl md:text-6xl">
          <span className="text-sky-400">All-in-one interview prep platform</span> with innovative features you
          can&apos;t find elsewhere.
        </p>
        <p className="mt-8 text-base text-slate-500 md:text-lg">
          Plus, get{" "}
          <Link href="/pricing" className="text-slate-800 underline underline-offset-4 hover:text-slate-950">
            unlimited AI mock interviews
          </Link>{" "}
          on every paid plan.
        </p>
      </section>

      {/* Bento features */}
      <section id="features" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-24">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-md text-3xl font-medium leading-[1.1] tracking-[-0.025em] text-slate-950 md:text-5xl">
            Feel the best experience with our features
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-slate-500">
            Every module you see here lives inside your CUS Interview dashboard, and your progress is tracked across all of them.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
          {BENTO.map((item) => {
            return (
              <Link
                key={item.title}
                href={item.href}
                className={`flex flex-col overflow-hidden rounded-[24px] p-6 transition-transform duration-300 hover:-translate-y-1 ${item.bg} ${item.span}`}
              >
                <h3 className="text-xl font-semibold tracking-tight text-slate-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{item.description}</p>

                {item.chips ? (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {item.chips.map((chip) => (
                      <Chip key={chip}>{chip}</Chip>
                    ))}
                  </div>
                ) : null}


                <div className="-mb-6 mt-auto flex justify-center pt-6">{item.art}</div>
              </Link>
            );
          })}

          {/* Progress & streaks — full width */}
          <Link href="/profile" className="grid grid-cols-1 items-center gap-6 overflow-hidden rounded-[24px] bg-[#fddddd] p-6 transition-transform duration-300 hover:-translate-y-1 md:col-span-2 lg:col-span-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
            <div>
              <h3 className="text-xl font-semibold tracking-tight text-slate-950">Progress &amp; streaks</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                Practice days, correct answers, levels completed, current and best streak — all on your profile, with a
                searchable history of every attempt.
              </p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <FeatureArt name="progress" alt="Progress chart and day streak" w={835} h={325} className="w-full max-w-[380px]" />
            </div>
          </Link>
        </div>
      </section>

      {/* Role tracks — at a glance */}
      <section className="mx-auto max-w-6xl px-6 pb-20 md:pb-24">
        <span className="inline-flex rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white">
          Your prep workspace
        </span>
        <h2 className="mt-6 max-w-3xl text-4xl font-medium leading-[1.1] tracking-[-0.025em] text-slate-950 md:text-6xl">
          Everything you need to prepare, at a glance.
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ROLES.map((role) => (
            <Link
              key={role.title}
              href="/dashboard/programming-languages"
              className={`group relative flex min-h-[250px] flex-col overflow-hidden rounded-[28px] p-7 transition-transform duration-300 hover:-translate-y-1 ${role.bg}`}
            >
              <h3 className="max-w-[12rem] text-2xl font-bold leading-tight tracking-tight text-slate-950">
                {role.title}
              </h3>
              <p className="mt-3 max-w-[16rem] text-sm leading-relaxed text-slate-700">{role.stack}</p>
              <span className="mt-auto inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-white transition-transform group-hover:translate-x-1">
                <ArrowRight className="h-5 w-5" />
              </span>
              <span className="absolute bottom-5 right-5 transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-2">
                <RoleIllustration art={role.art} color={role.color} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Deep dives — stack on scroll */}
      <StackedDeepDives />
    </div>
  );
}
