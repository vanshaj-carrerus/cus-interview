"use client";

const COURSES = [
  {
    title: "Java",
    count: "15 Problems",
    progress: 75,
    color: "bg-red-500",
    icon: (
      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl shadow-sm border border-red-100">
        ☕
      </div>
    ),
  },
  {
    title: "JavaScript",
    count: "22 Problems",
    progress: 40,
    color: "bg-yellow-400",
    icon: (
      <div className="w-10 h-10 bg-[#f7df1e] rounded-lg flex items-center justify-center text-xs font-black text-black shadow-sm">
        JS
      </div>
    ),
  },
  {
    title: "Python",
    count: "18 Problems",
    progress: 60,
    color: "bg-blue-500",
    icon: (
      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl shadow-sm border border-blue-100">
        🐍
      </div>
    ),
  },
  {
    title: "C++",
    count: "20 Problems",
    progress: 30,
    color: "bg-sky-600",
    icon: (
      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-sm font-black text-sky-600 shadow-sm border border-sky-100">
        C++
      </div>
    ),
  },
];

export default function FastTrackCourses() {
  return (
    <section className="py-24 bg-white relative">
      <div className=" max-w-7xl md:container! mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl text-center md:text-left">
            <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-4">Career Development</h2>
            <h3 className="text-4xl md:text-5xl font-black text-secondary tracking-tight leading-none">
              Upskill with our <br />
              <span className="premium-text-gradient">Professional Solutions</span>
            </h3>
          </div>
          <button className="text-secondary/40 text-sm font-black uppercase tracking-widest hover:text-primary transition-colors">
            View all courses
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {COURSES.map((course) => (
            <div
              key={course.title}
              className="pro-card p-8 group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-8">
                {course.icon}
                <div className="text-right">
                  <span className="block text-secondary/40 text-[10px] font-black uppercase tracking-widest">Questions</span>
                  <span className="block font-black text-secondary text-sm">{course.count}</span>
                </div>
              </div>

              <h4 className="text-xl font-black text-secondary mb-6 group-hover:text-primary transition-colors">
                {course.title}
              </h4>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-secondary/40">
                  <span>Completion</span>
                  <span className="text-secondary">{course.progress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${course.color} transition-all duration-1000 ease-out`}
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>

              <button className="mt-8 w-full py-3 rounded-xl bg-slate-50 text-secondary text-xs font-black uppercase tracking-widest group-hover:bg-primary group-hover:text-white transition-all">
                Continue Learning
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
