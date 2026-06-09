import Link from "next/link";
import { getTrackCards } from "@/lib/learning/server";
import Image from "next/image";
import { ChevronRight, Target, BookOpen, Layers, Sparkles } from "lucide-react";

export const revalidate = 60;

export default async function CoursesRoadmapHomePage() {
  const courses = await getTrackCards("course");
  
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans text-slate-900 pb-20">
      {/* Professional Dot Grid Background */}
      <div className="absolute inset-0 z-0 opacity-[0.5] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
      />
      
      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10 pt-12">
        <header className="mb-12 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700">
              Structured Learning
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            Language & Course <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Roadmaps</span>
          </h1>
          
          <p className="text-slate-500 text-sm md:text-base max-w-2xl leading-relaxed font-medium">
            Master a new language or deep dive into complex architectures with our carefully crafted, step-by-step interview curriculums.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {courses.map((course, index) => {
             const colors = [
               { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100", hoverRing: "group-hover:ring-blue-500/20" },
               { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-100", hoverRing: "group-hover:ring-purple-500/20" },
               { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100", hoverRing: "group-hover:ring-amber-500/20" },
               { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100", hoverRing: "group-hover:ring-emerald-500/20" },
               { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-100", hoverRing: "group-hover:ring-rose-500/20" },
               { bg: "bg-cyan-50", text: "text-cyan-600", border: "border-cyan-100", hoverRing: "group-hover:ring-cyan-500/20" }
             ];
             const theme = colors[index % colors.length];
             
             return (
              <Link
                key={course.id}
                href={`/problems/courses/${course.slug}`}
                className={`group flex flex-col h-full bg-white/70 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.05)] hover:bg-white hover:-translate-y-1 hover:border-slate-300/80 ring-2 ring-transparent ${theme.hoverRing}`}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-12 h-12 ${theme.bg} ${theme.text} rounded-xl flex items-center justify-center border ${theme.border} shadow-sm group-hover:scale-110 transition-transform duration-300 ease-out`}>
                    {course.iconImage ? (
                      <Image src={course.iconImage} alt={`${course.title} icon`} loading="lazy" className="h-7 w-7 rounded-lg object-cover" width={48} height={48} />
                    ) : (
                      <Layers className="w-6 h-6" />
                    )}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-colors duration-300 shadow-sm">
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>
                
                <div className="mb-2">
                  <h2 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors duration-300">{course.title}</h2>
                </div>
                
                <p className="text-slate-500 text-[13px] leading-relaxed mb-6 flex-grow font-medium line-clamp-3">
                  {course.intro}
                </p>
                
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center gap-2 text-slate-400 group-hover:text-indigo-500 transition-colors duration-300">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-[0.15em]">
                    {course.levels || 0} Modules
                  </span>
                </div>
              </Link>
             );
          })}
        </div>
      </div>
    </div>
  );
}
