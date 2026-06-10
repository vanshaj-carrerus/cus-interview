import Image from "next/image";
import { Building2, Globe2, Sparkles, TrendingUp } from "lucide-react";

const COMPANIES = [
  { name: "Facebook", src: "/logos/facebook.png" },
  { name: "Amazon", src: "/logos/amazon.png" },
  { name: "Accenture", src: "/logos/accenture.png" },
  { name: "Goldman Sachs", src: "/logos/goldman-sachs.png" },
  { name: "HP", src: "/logos/hp.png" },
  { name: "TCS", src: "/logos/tcs.png" },
  { name: "HCL", src: "/logos/HCL.png" },
  { name: "Comcast", src: "/logos/comcast.png" },
  { name: "Humana", src: "/logos/humana.png" },
  { name: "TIAA", src: "/logos/tiaa.png" },
  { name: "Gainsight", src: "/logos/gainsight-company.png" },
];

const highlights = [
  {
    icon: <Building2 size={18} className="text-purple-500" />,
    label: "Fortune 500 Companies",
    bg: "bg-purple-50",
  },
  {
    icon: <Globe2 size={18} className="text-teal-500" />,
    label: "Global Hiring Partners",
    bg: "bg-teal-50",
  },
  {
    icon: <TrendingUp size={18} className="text-orange-500" />,
    label: "Proven Career Outcomes",
    bg: "bg-orange-50",
  },
  {
    icon: <Sparkles size={18} className="text-pink-500" />,
    label: "Industry-Ready Skills",
    bg: "bg-pink-50",
  },
];

export default function CrackedInterviewsSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-md">
        <div className="border-b border-slate-100 px-8 py-12 text-center md:px-12 md:py-14">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-600">
            <Building2 size={12} />
            Success Stories
          </div>

          <h2 className="text-3xl font-extrabold leading-tight text-slate-900 md:text-4xl">
            Our Users Have
          </h2>
          <h2
            className="mb-4 text-3xl font-extrabold leading-tight md:text-4xl"
            style={{ color: "#6c5ce7" }}
          >
            Cracked interviews at
          </h2>

          <p className="mx-auto max-w-lg text-[15px] leading-relaxed text-slate-500">
            From tech giants to global enterprises learners on our platform have
            landed offers at companies that shape the industry.
          </p>
        </div>

        <div className="bg-linear-to-br from-slate-50 to-purple-50/30 px-6 py-10 md:px-10 md:py-12">
          <p className="mb-8 text-center text-[11px] font-semibold uppercase tracking-widest text-slate-400">
            Where Our Learners Work
          </p>

          <ul className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-3 md:gap-4">
            {COMPANIES.map((company) => (
              <li key={company.name}>
                <div className="group flex h-[72px] w-[132px] items-center justify-center rounded-2xl border border-slate-100 bg-white p-2 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:w-[148px]">
                  <div className="flex h-full w-full items-center justify-center rounded-xl px-3">
                    <Image
                      src={company.src}
                      alt={company.name}
                      width={120}
                      height={36}
                      className="h-7 w-auto max-w-full object-contain transition-transform duration-200 group-hover:scale-105 md:h-8"
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
