"use client";

import { Target, Lightbulb, TrendingUp, Building, Award, Users } from "lucide-react";

export default function AboutContent() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto mb-20">
        
        <h1 className="text-4xl md:text-6xl font-black text-slate-800 mb-6 tracking-tight">
          About <span className="bg-gradient-to-r from-sky-400 to-pink-400 bg-clip-text text-transparent">CUS Interview</span>
        </h1>
        <p className="text-xl text-slate-500 leading-relaxed font-medium">
          &quot;Learn, Practice, and Excel&quot;
        </p>
        <p className="mt-6 text-lg text-slate-600 leading-relaxed">
          CUS Interview is a comprehensive educational portal that empowers learners across multiple domains—spanning computer science, essential software tools, and top-tier interview preparation services.
        </p>
      </div>

      {/* Corporate Profile Section */}
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 mb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-sky-50 to-pink-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3" />
        <div className="relative z-10 space-y-6 text-slate-600 leading-relaxed text-lg">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 border-b border-slate-100 pb-4">Company Profile & Brand</h2>
          <p>
            With a growing community of registered users, CUS Interview provides a vast collection of tutorials, interview guides, concept explainers, coding challenges, and structured courses tailored for both academic success and professional growth.
          </p>
          <p>
            We are particularly recognized for our in-depth interview preparation resources, helping candidates secure roles at top tech companies through our curated content, AI mock interviews, and specialized tracks.
          </p>
          <p>
            Our high-demand technology courses—such as Data Structures and Algorithms (DSA), System Design, Web Development, and Machine Learning—are crafted by industry experts. We ensure that every piece of content adds credibility and significantly enhances our learners&apos; career prospects.
          </p>
          <p className="font-semibold text-slate-800 text-xl pt-4">
            At CUS Interview, we&apos;re more than just a platform—we&apos;re a community. A space to learn, grow, and stay ahead in the ever-evolving world of education and technology.
          </p>
        </div>
      </div>

      {/* Core Values Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-20">
        <div className="bg-gradient-to-b from-sky-50/50 to-white p-8 rounded-3xl border border-sky-100 shadow-sm hover:shadow-md transition-shadow group">
          <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 text-sky-500 group-hover:scale-110 transition-transform">
            <Target className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4">Our Mission</h3>
          <p className="text-slate-600 leading-relaxed">
            To empower learners by providing accessible, high-quality educational content that bridges the gap between theory and practical application—helping them excel in their careers.
          </p>
        </div>

        <div className="bg-gradient-to-b from-pink-50/50 to-white p-8 rounded-3xl border border-pink-100 shadow-sm hover:shadow-md transition-shadow group">
          <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 text-pink-500 group-hover:scale-110 transition-transform">
            <Lightbulb className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4">Our Vision</h3>
          <p className="text-slate-600 leading-relaxed">
            To be the most comprehensive and trusted learning platform—enabling individuals from all walks of life to access knowledge, gain confidence, and succeed in their journeys.
          </p>
        </div>

        <div className="bg-gradient-to-b from-indigo-50/50 to-white p-8 rounded-3xl border border-indigo-100 shadow-sm hover:shadow-md transition-shadow group">
          <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 text-indigo-500 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4">Our Motto</h3>
          <p className="text-slate-600 leading-relaxed">
            &quot;Learn, Practice, and Excel&quot; — A steadfast commitment to lifelong learning, hands-on experience, and achieving personal and professional growth.
          </p>
        </div>
      </div>

      {/* History & Leadership */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-slate-50 rounded-xl">
              <Award className="w-6 h-6 text-slate-700" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Corporate History</h2>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Founded with a vision to simplify complex coding concepts, CUS Interview began as a focused technical platform. Over the years, under the umbrella of Sanchhaya Education Pvt Ltd, it has evolved into a full-spectrum educational ecosystem—supporting learners in programming, corporate skill-building, and professional recruitment.
          </p>
        </div>

        <div className="bg-slate-900 p-8 md:p-10 rounded-3xl shadow-sm text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-sky-500/20 to-pink-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Leadership</h2>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Fueled by an unwavering passion for education and technology, our leadership team laid the bedrock upon which CUS Interview stands today. Their indomitable spirit has been instrumental in our remarkable growth. As the steadfast driving force behind the company, they remain a beacon of guidance, propelling the team to craft transformative learning experiences.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}