"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

function Counter({
  end,
  suffix = "",
}: {
  end: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;

      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function FeatureCards() {
  const cards = [
    {
      title: "Practice Problems",
      description: "Master DSA & Development with curated coding challenges.",
      image: "/practice-card.png",
      href: "/practice",
      gradient: "from-violet-500 to-violet-700",
    },
    {
      title: "Fast Track Courses",
      description: "Industry-ready roadmaps to accelerate your career.",
      image: "/courses-card.png",
      href: "/courses",
      gradient: "from-amber-400 to-orange-600",
    },
    {
      title: "Interview Prep",
      description: "AI-powered mock interviews and expert guidance.",
      image: "/interview-card.png",
      href: "/interview",
      gradient: "from-emerald-500 to-teal-700",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="rounded-3xl py-12 px-6  ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="md:ms-5 md:ps-5 transition-all">
            <h4 className="text-5xl font-extrabold text-[#111827]">
              <Counter end={35000} suffix="+" />
            </h4>
            <p className="text-slate-400 mt-2 font-medium">Practice Questions</p>
          </div>

          <div className="md:ms-5 md:ps-5 transition-all">
            <h4 className="text-5xl font-extrabold text-[#111827]">
              <Counter end={10000} suffix="+" />
            </h4>
            <p className="text-slate-400 mt-2 font-medium">Mock Interviews</p>
          </div>

          <div className="md:ms-5 md:ps-5 transition-all">
            <h4 className="text-5xl font-extrabold text-[#111827]">
              <Counter end={500} suffix="+" />
            </h4>
            <p className="text-slate-400 mt-2 font-medium">Learning Paths</p>
          </div>
        </div>
      </div>
    </section>
  );
}