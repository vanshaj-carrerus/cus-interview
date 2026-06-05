import Link from "next/link";

export default function NewsLetter() {
  return (
    <section className="py-20 px-6 relative overflow-hidden bg-white">
      <div className="max-w-7xl md:container mx-auto">
        <div className="bg-slate-50 rounded-[2rem] p-8 md:p-20 relative overflow-hidden text-center shadow-sm border border-slate-200">
          
          {/* Animated Background Elements - Softened for a premium look */}
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-primary/5 to-transparent pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-accent-blue/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            
            <h2 className="text-xs font-bold text-primary uppercase tracking-widest mb-4">
              Shape Your Future
            </h2>
            
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight mb-6">
              Elevate your <br className="hidden sm:block" />
              <span className="text-primary">Professional Journey</span>
            </h3>
            
            <p className="text-slate-500 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl">
              Empowering IT talent and businesses with CareerUs Solutions and expert staffing services for lasting success.
            </p>

            {/* Enterprise CTA Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto">
              <Link
                href={"/signup"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 bg-slate-900 text-white font-medium text-base rounded-xl shadow-sm hover:bg-slate-800 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
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
            {/* <div className="mt-16 pt-10 border-t border-slate-200/60 w-full max-w-2xl flex flex-wrap justify-center items-center gap-10 md:gap-14 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              <span className="font-bold text-xl tracking-tight text-slate-700 uppercase">Google</span>
              <span className="font-bold text-xl tracking-tight italic text-slate-700">amazon</span>
              <span className="font-bold text-xl tracking-tight text-slate-700 uppercase">Microsoft</span>
              <span className="font-bold text-xl tracking-tight text-slate-700 uppercase">Meta</span>
            </div> */}
            
          </div>
        </div>
      </div>
    </section>
  );
}