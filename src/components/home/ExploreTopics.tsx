"use client";

import Link from "next/link";
import { ArrowRight, Code2, Bot, Coffee, Cpu } from "lucide-react";

const exploreTopics = [
  {
    title: "Coding Problems",
    description: "Master arrays, trees, graphs, dynamic programming and more with curated DSA problems.",
    href: "/problems",
    icon: <Code2 size={28} className="text-blue-500" />,
    
    tagColor: "bg-blue-100 text-blue-600",
    iconBg: "bg-blue-50",
    border: "border-blue-100",
    hoverBorder: "hover:border-blue-300",
    stat: "Explore DSA",
    statColor: "text-blue-500",
  },
  {
    title: "Mock Interview",
    description: "Practice your interview skills with our AI-driven mock interviews and get instant feedback.",
    href: "/mock-interviews",
    icon: <Bot size={28} className="text-rose-500" />,
  
    tagColor: "bg-rose-100 text-rose-600",
    iconBg: "bg-rose-50",
    border: "border-rose-100",
    hoverBorder: "hover:border-rose-300",
    stat: "Start Practicing",
    statColor: "text-rose-500",
  },
  {
    title: "Java Mastery",
    description: "Learn Object-Oriented Programming, Collections, Multithreading, and Advanced Java.",
    href: "/problems/courses/java-mastery",
    icon: <Coffee size={28} className="text-emerald-500" />,
   
    tagColor: "bg-emerald-100 text-emerald-600",
    iconBg: "bg-emerald-50",
    border: "border-emerald-100",
    hoverBorder: "hover:border-emerald-300",
    stat: "Learn Java",
    statColor: "text-emerald-500",
  },
  {
    title: "Machine Learning",
    description: "Dive into supervised, unsupervised learning, neural networks and model deployment.",
    href: "/problems/courses",
    icon: <Cpu size={28} className="text-violet-500" />,
   
    tagColor: "bg-violet-100 text-violet-600",
    iconBg: "bg-violet-50",
    border: "border-violet-100",
    hoverBorder: "hover:border-violet-300",
    stat: "Explore ML",
    statColor: "text-violet-500",
  },
];

export default function ExploreTopics() {
  return (
    <section className="max-w-7xl  mx-auto px-6 mb-20  py-10">
      {/* Heading */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800">Explore</h2>
        
      </div>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {exploreTopics.map((topic, i) => (
          <Link
            key={i}
            href={topic.href}
            className={`group flex flex-col justify-between bg-white rounded-2xl p-7 border ${topic.border} ${topic.hoverBorder} shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
          >
            {/* Top row: icon + tag */}
            <div className="flex items-start justify-between mb-5">
              <div className={`p-3 rounded-xl ${topic.iconBg}`}>
                {topic.icon}
              </div>
          
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-slate-800 leading-snug mb-2">
              {topic.title}
            </h3>

            {/* Description */}
            <p className="text-slate-500 text-sm leading-relaxed mb-5">
              {topic.description}
            </p>

            {/* Bottom: stat + view more */}
            <div className="flex items-center justify-between">
              <span className={`text-xs font-semibold ${topic.statColor}`}>
                {topic.stat}
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                View more
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
