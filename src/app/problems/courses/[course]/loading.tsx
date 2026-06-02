export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-12">
      <div className="max-w-5xl mx-auto animate-pulse">
        {/* Header */}
        <div className="h-12 w-72 bg-slate-200 rounded-xl mb-6" />
        <div className="h-6 w-full max-w-2xl bg-slate-200 rounded mb-12" />

        {/* Cards */}
        <div className="space-y-8">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="bg-white rounded-3xl border p-6"
            >
              <div className="h-6 w-48 bg-slate-200 rounded mb-4" />
              <div className="h-4 w-full bg-slate-200 rounded mb-2" />
              <div className="h-4 w-3/4 bg-slate-200 rounded mb-6" />
              <div className="h-10 w-32 bg-slate-200 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}