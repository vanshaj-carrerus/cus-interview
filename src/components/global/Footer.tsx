import Link from "next/link";
import Image from "next/image";
import { getTrackCards } from "@/lib/learning/server";

export default async function Footer() {
  const [tracks, courses] = await Promise.all([
    getTrackCards("track"),
    getTrackCards("course"),
  ]);

  return (
    <footer className="bg-secondary text-white/75 px-6 py-12 border-t border-white/10">
      <div className="max-w-7xl md:container! mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="max-w-sm space-y-4">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <Image
              src="/favicon.png"
              alt="CareerUs"
              width={40}
              height={40}
              className="rounded-xl shadow-md group-hover:opacity-90 transition-opacity"
              loading="lazy"
            />
            <div className="flex flex-col leading-none">
              <span className="font-black text-white text-lg tracking-tighter uppercase">
                CareerUs
              </span>
              <span className="text-primary text-[8px] font-black tracking-[0.3em] uppercase">
                Interview Solutions
              </span>
            </div>
          </Link>

          <p className="text-sm text-white/60 leading-relaxed">
            Structured practice, language tracks, and realistic mock interviews
            in one place.
          </p>
        </div>

        {/* Tracks */}
        <nav aria-label="Tracks">
          <h2 className="text-white font-black text-xs uppercase tracking-widest mb-4">
            Tracks
          </h2>

          <ul className="space-y-2">
            {tracks.slice(0, 6).map((track) => (
              <li key={track.id}>
                <Link
                  href={`/problems/${track.slug}`}
                  className="text-sm text-white/70 hover:text-primary transition-colors"
                >
                  {track.title}
                </Link>
              </li>
            ))}

            <li>
              <Link
                href="/practice"
                className="text-primary text-sm font-bold hover:underline"
              >
                View All →
              </Link>
            </li>
          </ul>
        </nav>

        {/* Languages / Courses */}
        <nav aria-label="Languages">
          <h2 className="text-white font-black text-xs uppercase tracking-widest mb-4">
            Languages
          </h2>

          <ul className="space-y-2">
            {courses.slice(0, 6).map((course) => (
              <li key={course.id}>
                <Link
                  href={`/problems/courses/${course.slug}`}
                  className="text-sm text-white/70 hover:text-primary transition-colors"
                >
                  {course.title}
                </Link>
              </li>
            ))}

            <li>
              <Link
                href="/practice"
                className="text-primary text-sm font-bold hover:underline"
              >
                View All →
              </Link>
            </li>
          </ul>
        </nav>

        {/* Mock Interviews */}
        <nav aria-label="Mock Interviews">
          <h2 className="text-white font-black text-xs uppercase tracking-widest mb-4">
            Mock Interviews
          </h2>

          <ul className="space-y-2">
            <li>
              <Link
                href="/mock-interviews"
                className="text-sm text-white/70 hover:text-primary transition-colors"
              >
                AI Mock Interviews
              </Link>
            </li>

            <li>
              <Link
                href="/mock-interviews"
                className="text-sm text-white/70 hover:text-primary transition-colors"
              >
                Technical Interviews
              </Link>
            </li>

            <li>
              <Link
                href="/mock-interviews"
                className="text-sm text-white/70 hover:text-primary transition-colors"
              >
                HR Interviews
              </Link>
            </li>

            <li>
              <Link
                href="/mock-interviews"
                className="text-primary text-sm font-bold hover:underline"
              >
                Start Practice →
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="max-w-7xl md:container! mx-auto mt-12 pt-8 border-t border-white/10 text-center text-xs text-white/45">
        © {new Date().getFullYear()} CareerUs Solutions. All rights reserved.
      </div>
    </footer>
  );
}