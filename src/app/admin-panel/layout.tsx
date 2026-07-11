import Link from "next/link";
import { ReactNode } from "react";
import Logo from "@/components/global/Logo";
import { connectDB } from "@/lib/mongodb";
import { LearningTrack } from "@/models/learning";
import SidebarLink from "./components/sidebar-link";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  await connectDB();
  const [tracks, courses] = await Promise.all([
    LearningTrack.find({ kind: "track" }).sort({ title: 1 }).select({ slug: 1, title: 1 }).lean(),
    LearningTrack.find({ kind: "course" }).sort({ title: 1 }).select({ slug: 1, title: 1 }).lean(),
  ]);

  return (
    <div className="min-h-screen bg-[#f5f6f8]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 text-secondary lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-primary/15 bg-white p-4 shadow-sm lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
          <div className="mb-5 space-y-4 border-b border-primary/10 pb-4">
            <Logo />
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold text-secondary">Admin Panel</h1>
              <Link href="/practice" className="text-xs text-primary hover:underline">
                Back
              </Link>
            </div>
          </div>

          <div className="space-y-5">
            <section>
              <p className="mb-2 text-xs uppercase tracking-wider text-primary">Core</p>
              <div className="space-y-1">
                <SidebarLink href="/admin-panel/learning-tracks" label="Practice Problems" />
                <SidebarLink href="/admin-panel/courses" label="Courses" />
                <SidebarLink href="/admin-panel/users" label="Users" />
                <SidebarLink href="/admin-panel/subscribers" label="Subscribers" />
              </div>
            </section>

            <section>
              <p className="mb-2 text-xs uppercase tracking-wider text-primary">Practice Sheets</p>
              <div className="space-y-1">
                {tracks.map((track) => (
                  <SidebarLink
                    key={String(track._id)}
                    href={`/admin-panel/learning-tracks/${String(track.slug)}`}
                    label={String(track.title)}
                  />
                ))}
              </div>
            </section>

            <section>
              <p className="mb-2 text-xs uppercase tracking-wider text-primary">Course Pages</p>
              <div className="space-y-1">
                {courses.map((course) => (
                  <SidebarLink
                    key={String(course._id)}
                    href={`/admin-panel/courses/${String(course.slug)}`}
                    label={String(course.title)}
                  />
                ))}
              </div>
            </section>
          </div>
        </aside>

        <section className="min-w-0 overflow-hidden rounded-2xl border border-primary/15 bg-white p-5 shadow-sm sm:p-6 lg:p-7">
          {children}
        </section>
      </div>
    </div>
  );
}
