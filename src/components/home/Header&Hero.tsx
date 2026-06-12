"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";



function CompanyLogo({ name, src }: { name: string; src: string }) {
  return (
    <div className="relative w-28 h-10 mx-4 cursor-default flex items-center justify-center">
      <Image src={src} alt={name} fill className="object-contain grayscale opacity-50" />
    </div>
  );
}



export default function CusInterviewHero() {


  return (
    <div className="relative bg-white overflow-hidden pb-1">


      {/* ── HERO CONTENT (CENTERED) ── */}
      <main className="relative md:pt-20 z-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">

          {/* Top Pill */}
          {/* <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full mb-8">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-primary text-[10px] font-black uppercase tracking-widest">
              Global Staffing & Coaching
            </span>
          </div> */}

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#111827] mt-0 leading-[1.1] tracking-tight mb-3 max-w-none mx-auto whitespace-nowrap">
            Build Your Dream Career with CUS.
          </h1>

          {/* Subtitle */}
          <p className="text-[#4E6F80] text-sm sm:text-lg font-medium  leading-relaxed mb-8">
            Mixpanel helps teams turn user behavior insights into <br className="hidden md:block" /> clear next steps, without delays or SQL bottlenecks.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center mb-16 w-full px-4">
            <Link href="https://www.custech.co/" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <button className="flex items-center justify-center gap-1.5 w-full sm:w-auto px-5 py-2.5 bg-[#18181b] hover:bg-black text-white text-[15px] font-semibold rounded-full cursor-pointer active:scale-95 transition-all">
                Get Started Free

              </button>
            </Link>

          </div>

          {/* Company Slider */}
          <div className="w-full max-w-5xl mx-auto mt- overflow-hidden relative pb-10">
            {/* Gradient Masks */}
            <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />



            <div className="flex w-[200%] animate-[marquee_35s_linear_infinite]">
              {/* First Set */}
              <div className="flex w-1/2 justify-around items-center px-4">
                <CompanyLogo name="Amazon" src="/logos/amazon.png" />
                <CompanyLogo name="Facebook" src="/logos/facebook.png" />
                <CompanyLogo name="Goldman Sachs" src="/logos/goldman-sachs.png" />
                <CompanyLogo name="TCS" src="/logos/tcs.png" />
                <CompanyLogo name="Accenture" src="/logos/accenture.png" />
                <CompanyLogo name="HCL" src="/logos/HCL.png" />
              </div>
              {/* Second Set (Duplicate for seamless loop) */}
              <div className="flex w-1/2 justify-around items-center px-4">
                <CompanyLogo name="Amazon" src="/logos/amazon.png" />
                <CompanyLogo name="Facebook" src="/logos/facebook.png" />
                <CompanyLogo name="Goldman Sachs" src="/logos/goldman-sachs.png" />
                <CompanyLogo name="TCS" src="/logos/tcs.png" />
                <CompanyLogo name="Accenture" src="/logos/accenture.png" />
                <CompanyLogo name="HCL" src="/logos/HCL.png" />
              </div>
            </div>

            <style>{`
              @keyframes marquee {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
              }
            `}</style>
          </div>

          {/* Dashboard Preview Image */}
          <div className="w-full max-w-6xl mx-auto mt-2 px-4 relative z-10 pb-16">
            <Image
              src="/dashboard-preview.png"
              alt="Dashboard Preview"
              width={1600}
              height={1100}
              className="w-full h-auto rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-200"
              priority
            />
          </div>

        </div>
      </main>
    </div>
  );
}