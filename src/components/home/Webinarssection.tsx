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
    <div className="flex flex-col min-w-87.5  max-w-95 shrink-0 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden cursor-pointer group">
      {/* Top Section / Category */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${event.badgeBg} ${event.badgeText}`}
          >
            {event.badgeLabel}
          </span>

          {/* <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-gray-900 group-hover:text-white transition-colors">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
              />
            </svg>
          </div> */}
        </div>

        {/* Content - Changed text-center to text-left here */}
        <h3 className="font-bold text-gray-900 text-xl leading-snug mb-3 text-left group-hover:text-[#4CB1E6] transition-colors line-clamp-2 h-14">
          {event.title}
        </h3>

        {/* Date - Changed justify-center to justify-start here */}
        <div className="flex items-center justify-start gap-2 text-gray-500 text-sm font-medium">
          <svg
            className="w-4 h-4 text-gray-400"
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
          {event.date}
        </div>
      </div>

      {/* Footer Area */}
      <div className="mt-auto p-6 pt-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
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
    <section className="bg-gray-50 py-29">
      <div className="max-w-450 w-350 mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col items-center justify-center gap-8 mb-12">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-4xl md:text-[40px] font-bold text-gray-900 tracking-tight mb-4">
              Expert-led Webinars & Masterclasses
            </h3>

            <p className="text-gray-500 text-lg mb-8 max-w-2xl mx-auto">
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
            className="hidden cursor-pointer md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border border-gray-200 items-center justify-center text-gray-600 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all shadow-lg"
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
            className="hidden cursor-pointer md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border border-gray-200 items-center justify-center text-gray-600 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all shadow-lg"
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
            className="flex gap-6 overflow-x-auto pb-8 pt-4 -mt-4 no-scrollbar scroll-smooth snap-x snap-mandatory"
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

            <div className="min-w-5 md:min-w-10 shrink-0" />
          </div>
        </div>

        {/* View All Link */}
        <div className="mt-6 text-center">
          <a
            href="#"
            className="inline-flex items-center justify-center gap-2 font-semibold text-gray-900 group-hover:text-[#4CB1E6] transition-colors group"
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