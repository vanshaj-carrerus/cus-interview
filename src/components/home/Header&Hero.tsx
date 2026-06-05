"use client";

import Link from "next/link";
import Image from "next/image";


const COMPANIES = [
  { name: "facebook", style: "font-bold text-black text-3xl tracking-tight lowercase" },
  { name: "Google", style: "font-normal text-black text-3xl" },
  { name: "amazon", style: "font-bold text-black text-3xl lowercase tracking-tighter" },
  { name: "media.net", style: "font-bold text-black text-2xl" },
  { name: "Flipkart", style: "font-bold italic text-black text-2xl" },
  { name: "PhonePe", style: "font-semibold text-black text-2xl" },
  { name: "Walmart", style: "font-bold text-black text-2xl" },
  { name: "gojek", style: "font-bold text-black text-2xl lowercase" },
  { name: "OYO", style: "font-black text-black text-3xl tracking-widest" },
  { name: "ATLASSIAN", style: "font-bold text-black text-xl tracking-wider uppercase" },
  { name: "Goldman Sachs", style: "font-semibold text-black text-xl leading-tight" },
];

function CompanyLogo({ name, style }: { name: string; style: string }) {
  // if (name === "Goldman Sachs") {
  //   return (
  //     <div className="flex flex-col items-start opacity-50 hover:opacity-100 transition-opacity">
  //       <span className={style}>Goldman</span>
  //       <span className={style}>Sachs</span>
  //     </div>
  //   );
  // }
  return <span className={`${style}  opacity-50 hover:opacity-100 transition-all cursor-default  `}>{name}</span>;
}


export default function CusInterviewHero() {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden pb-32">
      {/* Background Elements - Adapted for Centered Layout */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] md:w-full h-[600px] bg-gradient-to-b from-primary/5 via-primary/5 to-transparent -z-10 rounded-b-[100%]" />
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[120px] -z-10" />

      {/* ── HERO CONTENT (CENTERED) ── */}
      <main className="relative md:pt-20 z-19">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">

          {/* Top Pill */}
          {/* <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full mb-8">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-primary text-[10px] font-black uppercase tracking-widest">
              Global Staffing & Coaching
            </span>
          </div> */}

          {/* Main Headline */}
          <h4 className="text-5xl  font-black text-secondary leading-[0.95] tracking-tight mb-5 max-w-4xl">
            Build Your Dream Career with CUS.
            {/* <span className="text-primary">Career Adventure</span>{" "}
            with CUS. */}
          </h4>

          {/* Sub-headline */}
          <p className="text-secondary/60 text-sm font-medium leading-relaxed mb-10 max-w-2xl mx-auto">
            Elevating career journeys through innovative IT solutions and our
            comprehensive job portal. Shape the future with CareerUs Solutions.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-5 justify-center mb-16 w-full px-4">
            <Link target="_blank" href={"http://custech.co/"} className="w-full sm:w-auto">
              <button className="w-full   font-semibold tracking-wide sm:w-auto px-6 py-3 text-[16px] bg-primary text-white font-black   tracking-[0.2em] rounded-2xl  cursor-pointer hover:bg-primary/90 transition-all">
                Apply for Jobs
              </button>
            </Link>
            <Link href={"/practice"} className="w-full sm:w-auto">
              <button className="w-full font-semibold tracking-wide sm:w-auto px-6 py-3 `bg-white border border-slate-200 text-secondary font-black text-sm uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-50 transition-all cursor-pointer">
                Practice Now
              </button>
            </Link>
          </div>

          <div>
            <section className="max-w-4xl  mx-auto px-6 mb-14">
              {/* Inline CSS for the continuous infinite slider */}
              <style>
                {`
                   @keyframes infinite-slider {
                   0% { transform: translateX(0); }
                     100% { transform: translateX(-50%); }
                     }
                  .animate-infinite-slider {
            animation: infinite-slider 50s linear infinite;
            width: max-content;
          }
          .animate-infinite-slider:hover {
            animation-play-state: paused;
          }
        `}</style>

              <div className="relative w-full overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-12 md:before:w-12 before:bg-gradient-to-r before:from-white before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-12 md:after:w-12 after:bg-gradient-to-l after:from-white after:to-transparent">
                <div className="flex animate-infinite-slider items-center py-4">
                  {/* First Set of Companies */}
                  <div className="flex items-center gap-x-19 px-8">
                    {COMPANIES.map((c) => (
                      <div key={`set1-${c.name}`} className="flex-shrink-0">
                        <CompanyLogo name={c.name} style={c.style} />
                      </div>
                    ))}
                  </div>
                  {/* Second Set of Companies (Duplicate for seamless loop) */}
                  <div className="flex items-center gap-x-16 px-8">
                    {COMPANIES.map((c) => (
                      <div key={`set2-${c.name}`} className="flex-shrink-0">
                        <CompanyLogo name={c.name} style={c.style} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* ── NEW CENTERED DASHBOARD MOCKUP ── */}
          <div className="w-full max-w-6xl relative mt-4">
            {/* Outer wrapper for shadow and glow */}
            <div className="absolute -inset-4 bg-primary/20 rounded-[3rem] blur-2xl -z-10" />

            <Image
              src="/hero-page.png"
              alt="CUS Dashboard Preview"
              width={1200}
              height={800}
              className="w-full h-auto rounded-2xl md:rounded-[2rem] border border-slate-200/60 shadow-[0_50px_100px_-20px_rgba(31,61,143,0.15)] object-cover bg-[#F8FAFC]"
              priority // Loads the hero image faster
            />
          </div>

        </div>
      </main>
    </div>
  );
}