"use client"

import { useState, useRef, useEffect } from "react";

// --- DATA ---

const COMPANIES = [
  { name: "facebook", style: "font-bold text-[#1877f2] text-3xl tracking-tight lowercase" },
  { name: "Google", style: "font-normal text-slate-500 text-3xl" },
  { name: "amazon", style: "font-bold text-slate-900 text-3xl lowercase tracking-tighter" },
  { name: "media.net", style: "font-bold text-slate-700 text-2xl" },
  { name: "Flipkart", style: "font-bold italic text-slate-600 text-2xl" },
  { name: "PhonePe", style: "font-semibold text-slate-600 text-2xl" },
  { name: "Walmart", style: "font-bold text-slate-500 text-2xl" },
  { name: "gojek", style: "font-bold text-slate-800 text-2xl lowercase" },
  { name: "OYO", style: "font-black text-slate-800 text-3xl tracking-widest" },
  { name: "ATLASSIAN", style: "font-bold text-slate-700 text-xl tracking-wider uppercase" },
  { name: "Goldman Sachs", style: "font-semibold text-slate-500 text-xl leading-tight" },
];

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

function CompanyLogo({ name, style }: { name: string; style: string }) {
  if (name === "Goldman Sachs") {
    return (
      <div className="flex flex-col items-start leading-tight opacity-50 hover:opacity-100 transition-opacity">
        <span className={style}>Goldman</span>
        <span className={style}>Sachs</span>
      </div>
    );
  }
  return <span className={`${style} opacity-40 hover:opacity-100 transition-all cursor-default grayscale hover:grayscale-0`}>{name}</span>;
}

function TestimonialCard({ testimonial }: { testimonial: (typeof TESTIMONIALS)[0] }) {
  return (
    <div className="pro-card p-8 flex flex-col gap-6 min-w-[380px] max-w-[420px] shrink-0 bg-white shadow-sm border border-slate-100">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
        <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V12M14.017 21H11.017C10.4647 21 10.017 20.5523 10.017 20V12C10.017 11.4477 10.4647 11 11.017 11H13.017V9C13.017 7.89543 12.1216 7 11.017 7H7.01704C6.46475 7 6.01704 7.44772 6.01704 8V15C6.01704 15.5523 6.46475 16 7.01704 16H10.017C10.5693 16 11.017 16.4477 11.017 17V20C11.017 20.5523 10.5693 21 10.017 21H14.017Z" />
        </svg>
      </div>

      <p className="text-secondary/60 text-sm leading-relaxed font-medium italic">
        &quot;{testimonial.text}&quot;
      </p>

      <div className="flex items-center gap-4 mt-auto pt-6 border-t border-slate-50">
        <div className={`w-12 h-12 rounded-2xl ${testimonial.avatarBg} flex items-center justify-center text-white font-black shadow-lg`}>
          {testimonial.avatar}
        </div>
        <div>
          <h4 className="font-bold text-secondary text-sm">{testimonial.name}</h4>
          <div className="flex flex-wrap gap-1.5 mt-1">
            <span className="text-secondary/30 text-[10px] font-bold uppercase tracking-wider">Offer from</span>
            {testimonial.offersFrom.map(offer => (
              <span key={offer} className="text-primary text-[10px] font-black uppercase tracking-wider">{offer}</span>
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
      left: dir === "right" ? 400 : -400,
      behavior: "smooth",
    });
  };

  return (
    <div className="pb-24 pt-12 overflow-hidden bg-white">
      {/* ── COMPANIES SECTION ── */}
      <section className=" max-w-7xl md:container! mx-auto px-6 mb-24">
        <div className="text-center mb-16">
          <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-4">Our Track Record</h2>
          <h3 className="text-3xl md:text-5xl font-black text-secondary tracking-tight">
            Elevating career journeys at <br />
            <span className="premium-text-gradient">Top Global Enterprises</span>
          </h3>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-10">
          {COMPANIES.map((c) => (
            <CompanyLogo key={c.name} name={c.name} style={c.style} />
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS SECTION ── */}
      <section className="bg-slate-50 py-24 relative">
        <div className=" max-w-7xl md:container! mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-12">
            <div className="max-w-2xl">
              <h2 className="text-sm font-black text-primary uppercase tracking-[0.2em] mb-4">Success Stories</h2>
              <h3 className="text-4xl md:text-5xl font-black text-secondary tracking-tight leading-none">
                Join <span className="text-primary italic">10,000+</span> <br />
                Professionals already on their way
              </h3>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all ${canScrollLeft ? "border-slate-200 text-slate-900 hover:bg-white hover:shadow-xl" : "border-slate-100 text-slate-300 opacity-50"
                  }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all ${canScrollRight ? "border-slate-200 text-slate-900 hover:bg-white hover:shadow-xl" : "border-slate-100 text-slate-300 opacity-50"
                  }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto pb-12 scroll-smooth no-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {TESTIMONIALS.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
