import { ReactNode } from "react";
import { connectDB } from "@/lib/mongodb";
import { LearningTrack } from "@/models/learning";
import AdminSidebar from "./components/admin-sidebar";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  await connectDB();
  const [tracks, courses] = await Promise.all([
    LearningTrack.find({ kind: "track" }).sort({ title: 1 }).select({ slug: 1, title: 1 }).lean(),
    LearningTrack.find({ kind: "course" }).sort({ title: 1 }).select({ slug: 1, title: 1 }).lean(),
  ]);

  const trackItems = tracks.map((track) => ({
    slug: String(track.slug),
    title: String(track.title),
  }));

  const courseItems = courses.map((course) => ({
    slug: String(course.slug),
    title: String(course.title),
  }));

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f6f8] text-secondary lg:flex-row">
      <aside className="flex w-full shrink-0 flex-col border-b border-primary/15 bg-white lg:sticky lg:top-0 lg:h-screen lg:w-[260px] lg:border-b-0 lg:border-r">
        <AdminSidebar tracks={trackItems} courses={courseItems} />
      </aside>

      <main className="min-w-0 flex-1 overflow-y-auto p-5 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
