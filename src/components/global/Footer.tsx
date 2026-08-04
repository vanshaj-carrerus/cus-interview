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

export default async function Footer() {
  const [tracks, courses] = await Promise.all([
    getTrackCards("track"),
    getTrackCards("course"),
  ]);

  return (
    <footer className="mt-auto bg-secondary text-slate-400">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 px-6 py-16 md:grid-cols-3 lg:grid-cols-5 lg:gap-8">
        <div className="col-span-2 md:col-span-3 lg:col-span-1">
          <h3 className="mb-4 text-sm font-semibold text-white">Products</h3>
          <div className="flex flex-col gap-2.5">
            <Link href="/problems" className="text-[13px] transition-colors hover:text-white">
              Practice Problems
            </Link>
            <Link href="/problems/courses" className="text-[13px] transition-colors hover:text-white">
              Programming Courses
            </Link>
            <Link href="/compiler" className="text-[13px] transition-colors hover:text-white">
              Online Compiler
            </Link>
            <Link href="/mock-interviews" className="text-[13px] transition-colors hover:text-white">
              Mock Interviews
            </Link>
            <Link href="/resume-analyzer" className="text-[13px] transition-colors hover:text-white">
              Resume Analyzer
            </Link>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold text-white">Solutions</h3>
          <div className="flex flex-col gap-2.5">
            <Link href="/mock-interviews/ai-mock" className="text-[13px] transition-colors hover:text-white">
              AI Mock Interviews
            </Link>
            <Link href="/practice" className="text-[13px] transition-colors hover:text-white">
              Interview Prep
            </Link>
            <Link href="/problems" className="text-[13px] transition-colors hover:text-white">
              DSA Practice
            </Link>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold text-white">Resources</h3>
          <div className="flex flex-col gap-2.5">
            {tracks.slice(0, 5).map((track) => (
              <Link
                key={track.id}
                href={`/problems/${track.slug}`}
                className="line-clamp-1 text-[13px] transition-colors hover:text-white"
              >
                {track.title}
              </Link>
            ))}
            <Link href="/problems" className="text-[13px] font-medium text-primary hover:text-primary/80">
              View all →
            </Link>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold text-white">About us</h3>
          <div className="flex flex-col gap-2.5">
            <Link href="/about" className="text-[13px] transition-colors hover:text-white">
              About Us
            </Link>
            <Link href="/contact" className="text-[13px] transition-colors hover:text-white">
              Contact
            </Link>
            <Link href="/privacy" className="text-[13px] transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-[13px] transition-colors hover:text-white">
              Terms
            </Link>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold text-white">Get started</h3>
          <div className="flex flex-col gap-2.5">
            <Link href="/signup" className="text-[13px] transition-colors hover:text-white">
              Create account
            </Link>
            <Link href="/pricing" className="text-[13px] transition-colors hover:text-white">
              Pricing
            </Link>
            <Link href="/login" className="text-[13px] transition-colors hover:text-white">
              Login
            </Link>
            {courses.slice(0, 3).map((course) => (
              <Link
                key={course.id}
                href={`/problems/courses/${course.slug}`}
                className="line-clamp-1 text-[13px] transition-colors hover:text-white"
              >
                {course.title}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-8 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-2">
            <Logo href="/" width={110} height={44} />
            <p className="text-[13px] text-slate-500">
              © {new Date().getFullYear()} CUS Interview. Built for the modern
              engineer.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              target="_blank"
              href="https://www.linkedin.com/company/cus-tech/posts/?feedView=all"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition-colors hover:border-white/20 hover:text-white"
            >
              <LinkedinIcon />
            </Link>
            <Link
              target="_blank"
              href="https://www.instagram.com/cus.tech_/"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition-colors hover:border-white/20 hover:text-white"
            >
              <InstagramIcon />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
