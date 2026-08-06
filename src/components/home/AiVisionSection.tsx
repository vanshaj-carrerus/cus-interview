export default function AiVisionSection() {
  return (
    <section className="relative overflow-hidden bg-white py-20 md:pb-32 md:pt-28">
      <div
        className="pointer-events-none absolute left-1/2 top-[32%] h-56 w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/25 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <h2 className="ai-vision-glow text-3xl font-bold leading-snug text-secondary md:text-4xl lg:text-5xl md:leading-snug">
          Master the Stack.
           Command the
AI.
        </h2>

        <div className="mx-auto mt-8 max-w-2xl space-y-5 text-[15px] leading-relaxed text-slate-600 md:text-base">
          <p className="text-[19px]">
            Software development has fundamentally changed. The modern developer
            doesn&apos;t just memorize syntax; they orchestrate AI tools, manage
            complex cloud architectures, and deploy scalable solutions faster than
            ever before. This shift transforms how we learn, how companies hire,
            and what it takes to stand out in the tech industry.
          </p>
          <p>
            We are embracing this revolution. We&apos;ve designed our training to
            forge developers who don&apos;t just adapt to the future—they build
            it.
          </p>
        </div>
      </div>
    </section>
  );
}
