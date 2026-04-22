export default function NewsLetter() {
  return (
    <section className="pt-10 pb-20 px-6 relative overflow-hidden bg-white">
      <div className=" max-w-7xl md:container! mx-auto">
        <div className="bg-slate-50 rounded-[3rem] p-12 md:p-24 relative overflow-hidden text-center shadow-[0_40px_80px_rgba(0,0,0,0.03)] border border-slate-100">
          {/* Animated Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(14,165,164,0.1),transparent)] pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-primary font-black text-xs uppercase tracking-[0.4em] mb-8">Shape Your Future</h2>
            <h3 className="text-4xl md:text-6xl font-black text-secondary tracking-tight leading-[1.1] mb-10">
              Elevate your <br />
              <span className="text-primary italic">Professional Journey</span>
            </h3>
            <p className="text-secondary/50 text-lg md:text-xl font-medium mb-12">
              Empowering IT talent and businesses with CareerUs Solutions and expert staffing services for lasting success.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
               <a
                href="#"
                className="w-full sm:w-auto px-12 py-5 bg-primary text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 transition-all"
               >
                 Get Started Free
               </a>
               <a
                href="#"
                className="w-full sm:w-auto px-12 py-5 bg-white border border-slate-200 text-secondary font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-50 transition-all"
               >
                 View Pricing
               </a>
            </div>

            <div className="mt-16 flex flex-wrap justify-center items-center gap-10 opacity-30">
               <span className="font-black text-xl tracking-tighter text-secondary uppercase">Google</span>
               <span className="font-black text-xl tracking-tighter italic text-secondary">amazon</span>
               <span className="font-black text-xl tracking-tighter text-secondary uppercase">Microsoft</span>
               <span className="font-black text-xl tracking-tighter text-secondary uppercase">Meta</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
