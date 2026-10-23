import Link from "next/link";
import Logo from "@/components/global/Logo";
import { getTrackCards } from "@/lib/learning/server";

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.555.556.9 1.11 1.152 1.772.249.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.216 1.79-.465 2.428a4.883 4.883 0 01-1.152 1.772c-.556.555-1.11.9-1.772 1.152-.637.249-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.216-2.428-.465a4.89 4.89 0 01-1.772-1.152 4.884 4.884 0 01-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772A4.897 4.897 0 015.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm6.5-.25a1.25 1.25 0 10-2.5 0 1.25 1.25 0 002.5 0zM12 9a3 3 0 110 6 3 3 0 010-6z" />
  </svg>
);

type FooterLink = { label: string; href: string };

export default async function Footer() {
  const [tracks, courses] = await Promise.all([
    getTrackCards("track"),
    getTrackCards("course"),
  ]);

  const groups: { title: string; links: FooterLink[] }[] = [
    {
      title: "Products",
      links: [
        { label: "Practice Problems", href: "/problems" },
        { label: "Programming Courses", href: "/problems/courses" },
        { label: "Online Compiler", href: "/compiler" },
        { label: "Mock Interviews", href: "/mock-interviews" },
        { label: "Resume Analyzer", href: "/resume-analyzer" },
      ],
    },
    {
      title: "Features",
      links: [
        { label: "AI Mock Interviews", href: "/mock-interviews/ai-mock" },
        { label: "Interview Prep", href: "/practice" },
        { label: "DSA Practice", href: "/problems" },
        { label: "Company Questions", href: "/dashboard/company-interviews" },
      ],
    },
    {
      title: "Resources",
      links: [
        ...tracks.slice(0, 5).map((t) => ({ label: t.title, href: `/problems/${t.slug}` })),
        { label: "View all →", href: "/problems" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "For Companies", href: "/for-companies" },
        { label: "Enterprise", href: "/enterprise" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
        { label: "Refund Policy", href: "/refund-policy" },
      ],
    },
    {
      title: "Get started",
      links: [
        { label: "Create account", href: "/signup" },
        { label: "Pricing", href: "/pricing" },
        { label: "Login", href: "/login" },
        ...courses.slice(0, 3).map((c) => ({ label: c.title, href: `/problems/courses/${c.slug}` })),
      ],
    },
  ];

  return (
    <footer className="relative mt-auto overflow-hidden bg-slate-950 text-white">
      {/* Soft pastel glows, echoing the landing page cards */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-sky-500/15 blur-[100px]" aria-hidden />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-violet-500/15 blur-[100px]" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-6 pt-16 md:pt-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.6fr)] lg:gap-16">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3" aria-label="CUS Interview home">
              <Logo href={null} variant="icon" width={42} height={42} />
              <span className="flex flex-col gap-1.5">
                <span className="block text-xl font-bold leading-none tracking-wide text-white">CUS</span>
                <span className="block text-[11px] font-semibold uppercase leading-none tracking-[0.24em] text-sky-300">
                  Interview
                </span>
              </span>
            </Link>
            <p className="mt-5 max-w-[17rem] text-sm leading-relaxed text-slate-400">
              AI-powered interview prep — practice real problems, take mock interviews, and get hired.
            </p>
            <Link
              href="/signup"
              className="mt-6 inline-flex items-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-100"
            >
              Start practicing free
            </Link>
          </div>

          {/* Link groups — 3 × 2 grid */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
            {groups.map((group) => (
              <div key={group.title}>
                <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {group.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="line-clamp-1 text-sm text-slate-300 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} CUS Interview. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.linkedin.com/company/cus-tech/posts/?feedView=all"
              aria-label="CUS Interview on LinkedIn"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition-colors hover:border-white/25 hover:text-white"
            >
              <LinkedinIcon />
            </Link>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.instagram.com/cus.tech_/"
              aria-label="CUS Interview on Instagram"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition-colors hover:border-white/25 hover:text-white"
            >
              <InstagramIcon />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
