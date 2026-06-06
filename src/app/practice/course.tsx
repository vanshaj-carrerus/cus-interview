import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import { getTrackCards } from "@/lib/learning/server";

export const revalidate = 60;

const COURSE_BACKGROUNDS = [
  "bg-blue-50",
  "bg-orange-50",
  "bg-purple-50",
  "bg-teal-50",
  "bg-amber-50",
  "bg-indigo-50",
];

export default async function AllCoursesPage() {
  const courseRows = await getTrackCards("course");

  const courses = courseRows.map((item) => ({
    ...item,
    name: item.title,
    href: `/problems/courses/${item.slug}`,
  }));

  return (
    <main className="min-h-screen bg-[#fcfcfd] p-6 md:p-12 font-sans text-slate-900 selection:bg-indigo-100 selection:text-primary">
      <div className="max-w-7xl mx-auto">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <header className="mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-secondary mb-4">
            All Languages & Syntax
          </h1>
          <p className="text-slate-500 text-lg font-light leading-relaxed max-w-2xl">
            Explore our complete library of language environments and fast-track modules.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {courses.map((course, index) => {
            const bgClass = COURSE_BACKGROUNDS[index % COURSE_BACKGROUNDS.length];
            
            return (
              <article key={course.id} className="h-full">
                <Link href={course.href} className="group block h-full">
                  <div className="flex flex-col items-center justify-center p-6 bg-white border border-slate-100 rounded-[2rem] transition-all duration-300 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] hover:border-slate-200 group-hover:-translate-y-1 h-full min-h-[180px]">
                    <div
                      className={`w-14 h-14 ${bgClass} rounded-2xl flex items-center justify-center text-lg font-bold mb-5 shadow-sm border border-white transition-transform group-hover:-translate-y-1`}
                    >
                      {course.iconImage ? (
                        <Image
                          src={course.iconImage}
                          alt={`${course.title} icon`}
                          className="h-10 w-10 object-cover rounded-lg"
                          width={200}
                          height={200}
                          loading="lazy"
                        />
                      ) : (
                        course.title.slice(0, 2).toUpperCase()
                      )}
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-slate-800 text-sm group-hover:text-primary transition-colors">
                        {course.title}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
                        {course.levels} Steps
                      </p>
                    </div>
                    <div className="mt-5 opacity-0 group-hover:opacity-100 transition-opacity absolute top-6 right-6">
                      <ArrowUpRight className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}