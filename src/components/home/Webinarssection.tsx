"use client";

import { useRef } from "react";

const EVENTS = [
  {
    id: 1,
    title: "Forward Deployed Engineer",
    date: "21 Apr 2026 • 07:30 PM",
    registered: "2.4k+",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-700",
    badgeLabel: "Engineering",
  },
  {
    id: 2,
    title: "Why AI-Native SDEs Are Getting Jobs Outside India Faster",
    date: "23 Apr 2026 • 07:30 PM",
    registered: "3.1k+",
    badgeBg: "bg-purple-50",
    badgeText: "text-purple-700",
    badgeLabel: "Career",
  },
  {
    id: 3,
    title: "S.O.L.I.D Principles in Modern Software",
    date: "25 Apr 2026 • 07:30 PM",
    registered: "1.8k+",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-700",
    badgeLabel: "Architecture",
  },
  {
    id: 4,
    title: "System Design for Senior Engineers",
    date: "27 Apr 2026 • 07:30 PM",
    registered: "4.5k+",
    badgeBg: "bg-orange-50",
    badgeText: "text-orange-700",
    badgeLabel: "System Design",
  },
  {
    id: 5,
    title: "System Design for Senior Engineers",
    date: "27 Apr 2026 • 07:30 PM",
    registered: "4.5k+",
    badgeBg: "bg-orange-50",
    badgeText: "text-orange-700",
    badgeLabel: "System Design",
  },
];

function EventCard({ event }: { event: (typeof EVENTS)[0] }) {
  return (
    <div className="flex flex-col w-[85vw] sm:w-[340px] shrink-0 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden cursor-pointer group">
      {/* Top Section / Category */}
      <div className="p-5 sm:p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${event.badgeBg} ${event.badgeText}`}
          >
            {event.badgeLabel}
          </span>
        </div>

        {/* Content */}
        <h3 className="font-bold text-gray-900 text-lg sm:text-xl leading-snug mb-16 text-left group-hover:text-[#4CB1E6] transition-colors line-clamp-2 h-14">
          {event.title}
        </h3>

        {/* Date */}
        <div className="flex items-center justify-start gap-2 text-gray-500 text-sm font-medium">
          <svg
            className="w-4 h-4 text-gray-400 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="truncate">{event.date}</span>
        </div>
      </div>

      {/* Footer Area */}
      <div className="mt-auto p-5 sm:p-6 pt-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex -space-x-2 mr-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full border-2 border-white bg-gray-200"
              />
            ))}
          </div>

          <span className="text-xs font-semibold text-gray-600">
            {event.registered}
          </span>
        </div>

        <button className="bg-white cursor-pointer text-gray-900 border border-gray-200 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all">
          Register
        </button>
      </div>
    </div>
  );
}

export default function WebinarsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "right" ? 340 : -340,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col items-center justify-center gap-8 mb-10 md:mb-12">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-3xl sm:text-4xl md:text-[40px] font-bold text-gray-900 tracking-tight mb-4">
              Expert-led Webinars & Masterclasses
            </h3>

            <p className="text-gray-500 text-base sm:text-lg mb-8 max-w-2xl mx-auto px-2">
              Attend practical sessions designed to improve your engineering
              skills and interview performance in real-time.
            </p>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll("left")}
            className="hidden cursor-pointer md:flex absolute -left-5 lg:-left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border border-gray-200 items-center justify-center text-gray-600 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all shadow-lg"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll("right")}
            className="hidden cursor-pointer md:flex absolute -right-5 lg:-right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border border-gray-200 items-center justify-center text-gray-600 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all shadow-lg"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
          
          <div
            ref={scrollRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto pb-8 pt-4 -mt-4 no-scrollbar scroll-smooth snap-x snap-mandatory"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {EVENTS.map((event) => (
              <div key={event.id} className="snap-start">
                <EventCard event={event} />
              </div>
            ))}

            {/* Spacer to ensure the last item can fully scroll into view */}
            <div className="min-w-[1px] shrink-0" />
          </div>
        </div>

        {/* View All Link */}
        <div className="mt-4 md:mt-6 text-center">
          <a
            href="#"
            className="inline-flex items-center justify-center gap-2 font-semibold text-gray-900 hover:text-[#4CB1E6] transition-colors group"
          >
            View Full Schedule

            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}