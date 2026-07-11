import { getTrackCards } from "@/lib/learning/server";
import { Sparkles } from "lucide-react";
import CoursesGridClient from "./courses-grid-client";

export const revalidate = 60;

export default async function CoursesRoadmapHomePage() {
  const courseCards = await getTrackCards("course");
  const trackCards = await getTrackCards("track");
  const courses = [...trackCards, ...courseCards];

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans text-slate-900 pb-20">
      {/* Professional Dot Grid Background */}
      <div className="absolute inset-0 z-0 opacity-[0.5] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10 pt-12">
        <header className="mb-12 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700">
              Structured Learning
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            Language & Course Roadmaps
          </h1>

          <p className="text-slate-500 text-sm md:text-base max-w-2xl leading-relaxed font-medium">
            Master a new language or deep dive into complex architectures with our carefully crafted, step-by-step interview curriculums.
          </p>
        </header>

        <CoursesGridClient courses={courses} />
      </div>
    </div>
  );
}
