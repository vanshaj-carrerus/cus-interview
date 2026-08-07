"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TESTIMONIALS = [
  {
    id: 1,
    quote:
      "The platform engages you and you learn a lot — you gain real confidence. Today I have offers from two big companies. I was preparing for a long time but never had the courage to apply. The moment I joined, things changed completely.",
    name: "Deepanshu",
    role: "Software Engineer",
  },
  {
    id: 2,
    quote:
      "CUS Interview prepares you not only for interviews, but for the actual job too. You learn to write error-free code and master professional technical communication.",
    name: "Syed",
    role: "Backend Developer",
  },
  {
    id: 3,
    quote:
      "A super interactive platform. After two months of coaching, I finally got placed at a dream company with an amazing package.",
    name: "Prashant",
    role: "Full Stack Developer",
  },
  {
    id: 4,
    quote:
      "I had been struggling with technical concepts for months. The structured approach made everything click. The mentors really understand industry standards.",
    name: "Ananya",
    role: "Frontend Engineer",
  },
];

export default function HomeTestimonials() {
  const [active, setActive] = useState(0);

  const prev = () =>
    setActive((i) => (i === 0 ? TESTIMONIALS.length - 1 : i - 1));
  const next = () =>
    setActive((i) => (i === TESTIMONIALS.length - 1 ? 0 : i + 1));

  return (
    <section className="bg-secondary py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h3 className="text-xl font-bold leading-snug text-white md:text-3xl lg:text-4xl">
          Loved by developers from all backgrounds
        </h3>

        <div className="relative mt-14 grid">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.id}
              className={`col-start-1 row-start-1 transition-opacity duration-300 ${i === active
                ? "visible opacity-100"
                : "invisible opacity-0"
                }`}
              aria-hidden={i !== active}
            >
              <blockquote className="font-serif text-xl leading-relaxed text-white/90 md:text-2xl lg:text-[1.3rem] lg:leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <p className="mt-8 text-sm font-medium text-slate-400">
                {t.name}, {t.role}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous testimonial"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-white/40 hover:text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to testimonial ${i + 1}`}
                onClick={() => setActive(i)}
                className={`h-2 rounded-full transition-all ${i === active
                  ? "w-6 bg-primary"
                  : "w-2 bg-white/30 hover:bg-white/50"
                  }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            aria-label="Next testimonial"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-white/40 hover:text-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
