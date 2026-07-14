import Link from "next/link";
import Logo from "@/components/global/Logo";
import { getTrackCards } from "@/lib/learning/server";
import { MapPin } from "lucide-react";

const FacebookIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>;
const TwitterIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>;
const InstagramIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.555.556.9 1.11 1.152 1.772.249.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.216 1.79-.465 2.428a4.883 4.883 0 01-1.152 1.772 c-.556.555-1.11.9-1.772 1.152-.637.249-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.216-2.428-.465a4.89 4.89 0 01-1.772-1.152 4.884 4.884 0 01-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772A4.897 4.897 0 015.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm6.5-.25a1.25 1.25 0 10-2.5 0 1.25 1.25 0 002.5 0zM12 9a3 3 0 110 6 3 3 0 010-6z" /></svg>;
const LinkedinIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>;
const YoutubeIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>;
const PlayIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M4 2v20c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2zm10.5 10l-4.5 3V7l4.5 3 2.5 1.5L14.5 12z" /></svg>;
const AppleIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm2.14 13.918c-.854.854-2.164.88-2.528.88-.364 0-1.468-.026-2.527-.88-1.577-1.282-3.136-4.63-1.636-8.238.718-1.722 2.06-2.593 3.268-2.593.712 0 1.554.218 2.088.62.534-.402 1.376-.62 2.088-.62 1.208 0 2.55.871 3.268 2.593.208.5-.23 1.054-.64.717-1.258-1.042-3.033-.087-3.033 1.621 0 1.488 1.463 2.55 3.02 1.696.425-.23.834.331.64.718-.5 1.205-1.517 2.658-2.923 3.485l-1.085.001zM11.66 4.312c1.076 0 1.815 1.034 1.815 2.163 0 .152-.016.31-.051.465-.964.073-1.956-.576-2.316-1.518-.171-.448-.135-.917.106-1.246.216-.296.536-.464.912-.464l-.466.6z" /></svg>;

export default async function Footer() {
  const [tracks, courses] = await Promise.all([
    getTrackCards("track"),
    getTrackCards("course"),
  ]);

  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8 mt-auto">
      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-10 lg:gap-6">

        {/* Brand & Details Column */}
        <div className="lg:col-span-3 flex flex-col gap-6 pr-4">
          <Logo className="transition-opacity hover:opacity-90" />

          <p className="text-[14px] text-slate-500 leading-relaxed mb-2">
            Empowering the next generation of tech talent with interactive courses, a premium online compiler, and AI-driven mock interviews. Learn, Practice, and Excel with us.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-2">
            <Link target="_blank" href="https://www.linkedin.com/company/cus-solution/" className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-sky-500 flex items-center justify-center transition-all group">
              <LinkedinIcon />
            </Link>
            <Link  target="_blank" href="https://www.instagram.com/cus_solution/" className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-sky-500 flex items-center justify-center transition-all group">
              <InstagramIcon />
            </Link>

            
          </div>
        </div>

        {/* Company Column */}
        <div className="flex flex-col gap-3 lg:col-span-1">
          <h3 className="font-bold text-sky-500 text-[15px] mb-2 inline-block">Company</h3>
          <Link href="/about" className="text-[13px] text-slate-500 hover:text-slate-900 transition-colors">About Us</Link>

          <Link href="/privacy" className="text-[13px] text-slate-500 hover:text-slate-900 transition-colors">Privacy Policy</Link>

          <Link href="/contact" className="text-[13px] text-slate-500 hover:text-slate-900 transition-colors">Contact Us</Link>

        </div>

        {/* Explore Column */}
        <div className="flex flex-col gap-3 lg:col-span-1">
          <h3 className="font-bold text-sky-500 text-[15px] mb-2 inline-block">Explore</h3>
          <Link href="/problems" className="text-[13px] text-slate-500 hover:text-slate-900 transition-colors">Practice Problems</Link>
          <Link href="/problems/courses" className="text-[13px] text-slate-500 hover:text-slate-900 transition-colors">Languages</Link>

          <Link href="/compiler" className="text-[13px] text-slate-500 hover:text-slate-900 transition-colors">Online Compiler</Link>
          <Link href="/mock-interviews" className="text-[13px] text-slate-500 hover:text-slate-900 transition-colors">Mock Interviews</Link>
        </div>

        {/* Tutorials Column */}
        <div className="flex flex-col gap-3 lg:col-span-1">
          <h3 className="font-bold text-sky-500 text-[15px] mb-2 inline-block">Tutorials</h3>
          {tracks.slice(0, 7).map((track) => (
            <Link
              key={track.id}
              href={`/problems/${track.slug}`}
              className="text-[13px] text-slate-500 hover:text-slate-900 transition-colors line-clamp-1"
            >
              {track.title}
            </Link>
          ))}
          <Link href="/problems" className="text-[13px] text-slate-500 font-semibold hover:opacity-80 transition-opacity mt-1 inline-flex items-center">View All </Link>
        </div>

        {/* Courses Column */}
        <div className="flex flex-col gap-3 lg:col-span-1">
          <h3 className="font-bold text-sky-500 text-[15px] mb-2 inline-block">Courses</h3>
          {courses.slice(0, 7).map((course) => (
            <Link
              key={course.id}
              href={`/problems/courses/${course.slug}`}
              className="text-[13px] text-slate-500 hover:text-slate-900 transition-colors line-clamp-1"
            >
              {course.title}
            </Link>
          ))}
          <Link href="/problems/courses" className="text-[13px] text-slate-500 font-semibold hover:opacity-80 transition-opacity mt-1 inline-flex items-center">View All </Link>
        </div>

        {/* Preparation Corner Column */}
        <div className="flex flex-col gap-3 lg:col-span-1">
          <h3 className="font-bold text-sky-500 text-[15px] mb-2 inline-block">Preparation Corner</h3>
          <Link href="/mock-interviews" className="text-[13px] text-slate-500 hover:text-slate-900 transition-colors">Interview Corner</Link>
          <Link href="/mock-interviews/ai-mock" className="text-[13px] text-slate-500 hover:text-slate-900 transition-colors">AI Mock Interviews</Link>
          <Link href="/problems" className="text-[13px] text-slate-500 hover:text-slate-900 transition-colors">Aptitude & Puzzles</Link>
          <Link href="/problems/courses" className="text-[13px] text-slate-500 hover:text-slate-900 transition-colors">System Design</Link>
          <Link href="/practice" className="text-[13px] text-slate-500 hover:text-slate-900 transition-colors">Top 150 Questions</Link>
        </div>

      </div>

      <div className="bg-slate-50 py-6 mt-12 border-t border-slate-200">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-start text-[13px] text-slate-500">
          &copy; {new Date().getFullYear()} CUS Interview. All rights reserved.
        </div>
      </div>
    </footer>
  );
}