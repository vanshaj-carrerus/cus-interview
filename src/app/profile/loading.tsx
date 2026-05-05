export default function ProfileLoading() {
  return (
    <div className="bg-slate-50/80 min-h-[calc(100vh-5rem)] pb-16">
      <div className="max-w-7xl md:container mx-auto px-4 sm:px-6 py-8 lg:py-10">
        <div className="h-8 w-48 rounded-lg bg-primary/15 animate-pulse mb-8" aria-hidden />

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          <aside className="w-full lg:w-72 shrink-0">
            <div className="rounded-2xl border border-secondary/10 bg-white p-6 shadow-sm sticky top-24 space-y-4">
              <div className="mx-auto h-20 w-20 rounded-2xl bg-primary/15 animate-pulse" />
              <div className="h-5 w-3/4 mx-auto rounded bg-secondary/15 animate-pulse" />
              <div className="h-3 w-full rounded bg-secondary/10 animate-pulse" />
              <div className="h-px bg-secondary/10" />
              <div className="h-3 w-full rounded bg-secondary/10 animate-pulse" />
            </div>
          </aside>

          <div className="flex-1 min-w-0 space-y-10">
            <section className="space-y-4">
              <div className="h-6 w-40 rounded bg-secondary/15 animate-pulse" />
              <div className="h-4 max-w-md rounded bg-secondary/10 animate-pulse" />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-secondary/10 bg-white p-4 shadow-sm space-y-2"
                  >
                    <div className="h-2 w-2/3 rounded bg-primary/15 animate-pulse" />
                    <div className="h-7 w-1/2 rounded bg-secondary/15 animate-pulse" />
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <div className="h-6 w-56 rounded bg-secondary/15 animate-pulse" />
              <div className="rounded-2xl border border-secondary/10 bg-white p-6 shadow-sm h-40 bg-primary/5 animate-pulse" />
            </section>

            <section className="space-y-4">
              <div className="h-6 w-48 rounded bg-secondary/15 animate-pulse" />
              <div className="rounded-2xl border border-secondary/10 bg-white p-6 shadow-sm min-h-[200px] bg-primary/5 animate-pulse" />
            </section>

            <section className="space-y-4">
              <div className="h-6 w-40 rounded bg-secondary/15 animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-secondary/10 bg-white p-6 shadow-sm h-56 bg-primary/5 animate-pulse" />
                <div className="rounded-2xl border border-secondary/10 bg-white p-6 shadow-sm h-56 bg-primary/5 animate-pulse" />
              </div>
            </section>

            <section className="space-y-4">
              <div className="h-6 w-64 rounded bg-secondary/15 animate-pulse" />
              <div className="rounded-2xl border border-secondary/10 bg-white p-6 shadow-sm h-32 bg-primary/5 animate-pulse" />
            </section>
          </div>
        </div>

        <p className="sr-only">Loading profile…</p>
      </div>
    </div>
  );
}
