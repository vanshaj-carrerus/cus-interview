"use client"

import { useState, useRef, useEffect } from "react";

// --- DATA ---

const TESTIMONIALS = [
  {
    id: 1,
    text: "The website has been built in a very unique way, it engages you and you learn a lot, you gain a lot of confidence. Today when I am writing this review, I have offers from 2 big companies. I was preparing for a long time but never had the confidence to apply in any of big companies. The moment I joined things changed completely.",
    name: "Deepanshu Agarwal",
    avatar: "DA",
    avatarBg: "bg-accent-purple",
    offersFrom: ["Microsoft", "Fab", "MakeMyTrip"],
  },
  {
    id: 2,
    text: "CareerUs prepares you not only for interviews, but for the actual job too. You will learn to write error-free code and master professional technical communication.",
    name: "Syed Atif Ali",
    avatar: "SA",
    avatarBg: "bg-accent-blue",
    offersFrom: ["Amazon"],
  },
  {
    id: 3,
    text: "A super interactive platform. CareerUs allowed me to customize my career path. After 2 months of coaching, I finally got placed at a dream company with an amazing package.",
    name: "Prashant Sharma",
    avatar: "PS",
    avatarBg: "bg-accent-teal",
    offersFrom: ["Google"],
  },
  {
    id: 4,
    text: "I had been struggling with technical concepts for months. CareerUs Solutions' structured approach made everything click. The mentors really understand industry standards.",
    name: "Ananya Mehta",
    avatar: "AM",
    avatarBg: "bg-accent-orange",
    offersFrom: ["Flipkart", "PhonePe"],
  },
];

// --- SUBCOMPONENTS ---

function TestimonialCard({ testimonial }: { testimonial: (typeof TESTIMONIALS)[0] }) {
  return (
    // Added uniform width and h-full so all cards match the tallest one
    <div className="flex flex-col w-[340px] md:w-[380px] h-full shrink-0 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 hover:border-slate-300 transition-all duration-300 ease-out group">
      
      {/* Quote Icon */}
      <svg className="w-8 h-8 text-slate-200 mb-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V12M14.017 21H11.017C10.4647 21 10.017 20.5523 10.017 20V12C10.017 11.4477 10.4647 11 11.017 11H13.017V9C13.017 7.89543 12.1216 7 11.017 7H7.01704C6.46475 7 6.01704 7.44772 6.01704 8V15C6.01704 15.5523 6.46475 16 7.01704 16H10.017C10.5693 16 11.017 16.4477 11.017 17V20C11.017 20.5523 10.5693 21 10.017 21H14.017Z" />
      </svg>

      {/* Quote Text */}
      <p className="text-slate-700 text-[15px] leading-relaxed mb-8">
        "{testimonial.text}"
      </p>

      {/* Author Footer (mt-auto pushes this perfectly to the bottom on shorter cards) */}
      <div className="flex items-start gap-4 mt-auto pt-6 border-t border-slate-100">
        <div className={`w-12 h-12 rounded-full ${testimonial.avatarBg} flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0`}>
          {testimonial.avatar}
        </div>
        
        <div className="flex flex-col">
          <h4 className="font-bold text-slate-900 text-sm mb-1.5">{testimonial.name}</h4>
          
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400 text-[11px] font-medium mr-1">Offered by:</span>
            {testimonial.offersFrom.map((offer) => (
              <span 
                key={offer} 
                className="px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-md text-[10px] font-bold uppercase tracking-wider"
              >
                {offer}
              </span>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
}

// --- MAIN COMPONENT ---

export default function CompaniesAndTestimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll);
    checkScroll();
    return () => el.removeEventListener("scroll", checkScroll);
  }, []);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "right" ? 380 : -380,
      behavior: "smooth",
    });
  };

  return (
    <div className="pb-24 pt-12 overflow-hidden bg-white">
      {/* ── COMPANIES SECTION ── */}

      {/* ── TESTIMONIALS SECTION ── */}
      <section className="bg-slate-50 py-24 relative border-y border-slate-100">
        <div className="max-w-7xl md:container mx-auto px-6">
          
          {/* Header Area */}
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
            <div className="max-w-2xl text-center md:text-left">
              <h2 className="text-xs font-bold text-primary uppercase tracking-widest mb-3">
                Success Stories
              </h2>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
                Join <span className="text-primary">10,000+</span> Professionals <br className="hidden md:block" /> 
                already on their way
              </h3>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3 justify-center md:justify-end">
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-200 ${
                  canScrollLeft 
                    ? "border-slate-200 text-slate-600 bg-white hover:border-slate-300 hover:text-slate-900 hover:shadow-sm cursor-pointer" 
                    : "border-slate-200 text-slate-300 bg-slate-50 opacity-50 cursor-not-allowed"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-200 ${
                  canScrollRight 
                    ? "border-slate-200 text-slate-600 bg-white hover:border-slate-300 hover:text-slate-900 hover:shadow-sm cursor-pointer" 
                    : "border-slate-200 text-slate-300 bg-slate-50 opacity-50 cursor-not-allowed"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Carousel */}
          <div className="relative">
            <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

            {/* Added items-stretch to force equal height behavior on children */}
            <div
              ref={scrollRef}
              className="flex items-stretch gap-6 overflow-x-auto pb-10 pt-4 -mt-4 scroll-smooth no-scrollbar snap-x snap-mandatory"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {TESTIMONIALS.map((t) => (
                // Added flex to the wrapper so the TestimonialCard inherits height perfectly
                <div key={t.id} className="snap-start flex">
                  <TestimonialCard testimonial={t} />
                </div>
              ))}
              <div className="min-w-[20px] md:min-w-[40px] shrink-0" />
            </div>
          </div>
          
        </div>
      </section>
    </div>
  );
}