"use client";

import { useState, useRef } from "react";

const TABS = ["Software Dev", "Data Science", "All Events"];

const EVENTS = [
  {
    id: 1,
    title: "Forward Deployed Engineer",
    date: "07:30 PM, 21 Apr 2026",
    registered: "2.4k+",
    bg: "bg-primary/10",
    accent: "text-primary",
  },
  {
    id: 2,
    title: "Why AI-Native SDEs Are Getting Jobs Outside India Faster",
    date: "07:30 PM, 23 Apr 2026",
    registered: "3.1k+",
    bg: "bg-accent-purple/10",
    accent: "text-accent-purple",
  },
  {
    id: 3,
    title: "S.O.L.I.D Principles in Modern Software",
    date: "07:30 PM, 25 Apr 2026",
    registered: "1.8k+",
    bg: "bg-accent-blue/10",
    accent: "text-accent-blue",
    isCusInterview: true,
  },
  {
    id: 4,
    title: "System Design for Senior Engineers",
    date: "07:30 PM, 27 Apr 2026",
    registered: "4.5k+",
    bg: "bg-accent-orange/10",
    accent: "text-accent-orange",
  },
];

function EventCard({ event }: { event: (typeof EVENTS)[0] }) {
  return (
    <div className="pro-card flex flex-col min-w-[340px] max-w-[380px] shrink-0 overflow-hidden group">
      {/* Visual Area */}
      <div className={`h-48 ${event.bg} relative flex items-center justify-center p-8`}>
        <div className="relative z-10 w-full h-full bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 shadow-xl overflow-hidden flex flex-col items-center justify-center gap-2">
          <div className={`w-12 h-12 rounded-full ${event.bg.replace('/10', '')} flex items-center justify-center mb-2`}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            </svg>
          </div>
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${event.accent}`}>Masterclass</span>
        </div>
        {/* Animated blobs */}
        <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-30 ${event.bg.replace('/10', '')} animate-pulse`} />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col gap-4 flex-1">
        <h3 className="font-black text-slate-900 text-lg leading-tight group-hover:text-primary transition-colors">
          {event.title}
        </h3>

        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {event.date}
        </div>

        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full border border-white bg-slate-200" />)}
            <span className="pl-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{event.registered}</span>
          </div>
          <button className="bg-secondary text-white text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl hover:shadow-lg transition-all">
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WebinarsSection() {
  const [activeTab, setActiveTab] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "right" ? 400 : -400,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-white pb-24 pt-12">
      <div className=" max-w-7xl md:container! mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between gap-12 mb-16">
          <div className="max-w-2xl">
            <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-4">Live Learning</h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none mb-6">
              Expert-led <span className="premium-text-gradient">Webinars & Masterclasses</span>
            </h3>
            <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-lg">
              Attend practical sessions designed to improve your interview performance in real-time.
            </p>
          </div>

          <div className="flex p-1.5 bg-slate-100 rounded-2xl overflow-hidden self-start md:self-auto">
            {TABS.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className={`px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === i ? "bg-white text-slate-900 shadow-md" : "text-slate-400 hover:text-slate-600"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative group/carousel">
          <div
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto pb-8 no-scrollbar scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {EVENTS.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
            <div className="min-w-[100px] shrink-0 lg:hidden" />
          </div>

          {/* Nav Arrows */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 w-14 h-14 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center text-slate-900 opacity-0 group-hover/carousel:opacity-100 transition-all hover:bg-slate-50 z-20"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 w-14 h-14 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center text-slate-900 opacity-0 group-hover/carousel:opacity-100 transition-all hover:bg-slate-50 z-20"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="mt-12 text-center">
          <a href="#" className="inline-flex items-center gap-2 font-black text-sm text-primary uppercase tracking-widest hover:gap-3 transition-all">
            View All Events
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
