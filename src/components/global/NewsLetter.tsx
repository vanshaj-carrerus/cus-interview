import Link from "next/link";

export default function NewsLetter() {
  return (
    <section className="py-16 px-6 relative overflow-hidden bg-white">
      {/* Reduced width from max-w-7xl to max-w-4xl to make it smaller and centered */}
      <div className="max-w-7xl mx-auto">
        {/* Adjusted padding to fit the smaller container perfectly */}
        <div className="bg-slate-50 rounded-[2rem] p-8 md:p-12 relative overflow-hidden text-center shadow-sm border border-slate-200">

          {/* Animated Background Elements - Softened for a premium look */}
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-primary/5 to-transparent pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-accent-blue/5 rounded-full blur-[80px] pointer-events-none" />

          {/* Scaled down the inner max width to match the new container */}
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">

            <h2 className="text-xs font-bold text-primary uppercase tracking-widest mb-3">
              Shape Your Future
            </h2>

            {/* Slightly reduced text sizes so it doesn't look cramped in the smaller box */}
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight mb-5">
              Elevate your <br className="hidden sm:block" />
              <span className="text-primary">Professional Journey</span>
            </h3>

            <p className="text-slate-500 text-base md:text-lg leading-relaxed mb-8 max-w-xl">
              Empowering IT talent and businesses with CareerUs Solutions and expert staffing services for lasting success.
            </p>

            {/* Enterprise CTA Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link
                href={"/signup"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-slate-900 text-white font-medium text-sm rounded-xl shadow-sm hover:bg-slate-800 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
              >
                Get Started Free
                <svg
                  className="w-4 h-4 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Trust Logos Footer */}
            {/* <div className="mt-12 pt-8 border-t border-slate-200/60 w-full max-w-xl flex flex-wrap justify-center items-center gap-8 md:gap-12 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              <span className="font-bold text-lg tracking-tight text-slate-700 uppercase">Google</span>
              <span className="font-bold text-lg tracking-tight italic text-slate-700">amazon</span>
              <span className="font-bold text-lg tracking-tight text-slate-700 uppercase">Microsoft</span>
              <span className="font-bold text-lg tracking-tight text-slate-700 uppercase">Meta</span>
            </div> */}

          </div>
        </div>
      </div>
    </section>
  );
} 