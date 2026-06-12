"use client";

import Link from "next/link";
import { ArrowRight, Code2, Bot, Coffee, Cpu } from "lucide-react";

const exploreTopics = [
  {
    title: "Coding Problems",
    description: "Master arrays, trees, graphs, dynamic programming and more with curated DSA problems.",
    href: "/problems",
    icon: <Code2 size={28} className="text-sky-500" />,

    tagColor: "bg-sky-100 text-sky-600",
    iconBg: "bg-sky-50",
    border: "border-sky-100",
    hoverBorder: "hover:border-sky-300",
    stat: "Explore DSA",
    statColor: "text-sky-500",
  },
  {
    title: "Mock Interview",
    description: "Practice your interview skills with our AI-driven mock interviews and get instant feedback.",
    href: "/mock-interviews",
    icon: <Bot size={28} className="text-sky-500" />,

    tagColor: "bg-sky-100 text-sky-600",
    iconBg: "bg-sky-50",
    border: "border-sky-100",
    hoverBorder: "hover:border-sky-300",
    stat: "Start Practicing",
    statColor: "text-sky-500",
  },
  {
    title: "Java Mastery",
    description: "Learn Object-Oriented Programming, Collections, Multithreading, and Advanced Java.",
    href: "/problems/courses/java-mastery",
    icon: <Coffee size={28} className="text-sky-500" />,

    tagColor: "bg-sky-100 text-sky-600",
    iconBg: "bg-sky-50",
    border: "border-sky-100",
    hoverBorder: "hover:border-sky-300",
    stat: "Learn Java",
    statColor: "text-sky-500",
  },
  {
    title: "Machine Learning",
    description: "Dive into supervised, unsupervised learning, neural networks and model deployment.",
    href: "/problems/courses/machine-learning-mastery",
    icon: <Cpu size={28} className="text-sky-500" />,

    tagColor: "bg-sky-100 text-sky-600",
    iconBg: "bg-sky-50",
    border: "border-sky-100",
    hoverBorder: "hover:border-sky-300",
    stat: "Explore ML",
    statColor: "text-sky-500",
  },
  {
    title: "HTML Mastery",
    description: "Dive into supervised, unsupervised learning, neural networks and model deployment.",
    href: "/problems/courses/html-mastery",
    icon: <Cpu size={28} className="text-sky-500" />,

    tagColor: "bg-sky-100 text-sky-600",
    iconBg: "bg-sky-50",
    border: "border-sky-100",
    hoverBorder: "hover:border-sky-300",
    stat: "Explore ML",
    statColor: "text-sky-500",
  },



  {
    title: "Operating System Mastery",
    description: "Dive into supervised, unsupervised learning, neural networks and model deployment.",
    href: "/problems/courses/os-mastery",
    icon: <Cpu size={28} className="text-sky-500" />,

    tagColor: "bg-sky-100 text-sky-600",
    iconBg: "bg-sky-50",
    border: "border-sky-100",
    hoverBorder: "hover:border-sky-300",
    stat: "Explore ML",
    statColor: "text-sky-500",
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {exploreTopics.map((topic, i) => (
          <Link
            key={i}
            href={topic.href}
            className={`group flex flex-col justify-between bg-white rounded-2xl p-7 border ${topic.border} shadow-sm`}
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
            <div className="flex items-center justify-end">
            
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600">
                View more
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
