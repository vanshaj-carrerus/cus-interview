import { Target } from "lucide-react";
import { getTrackCards } from "@/lib/learning/server";
import GatedTrackCards from "./components/gated-track-cards";

export const revalidate = 60;

type TrackCardData = {
  id: string;
  name: string;
  href: string;
  iconImage: string;
  levels: number;
};

export default async function Dashboard() {
  const trackRows = await getTrackCards("track");

  const tracks: TrackCardData[] = trackRows.map((item) => ({
    id: item.id,
    name: item.title,
    href: `/problems/${item.slug}`,
    iconImage: item.iconImage ?? "",
    levels: item.levels,
  }));

  return (
    <div className="min-h-screen bg-[#fcfcfd] p-6 font-sans text-slate-900 selection:bg-indigo-100 selection:text-primary md:p-12">
      <div className="mx-auto max-w-7xl">
        <header className="relative mb-24 flex flex-col items-center text-center">
          <div className="mb-14 max-w-3xl space-y-6">
            <div className="flex items-center justify-center gap-4">
              <span className="hidden h-px w-12 bg-slate-200 sm:block" />
              <span className="rounded-full border border-indigo-100/50 bg-indigo-50/80 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-primary">
                Your Personalized LMS
              </span>
              <span className="hidden h-px w-12 bg-slate-200 sm:block" />
            </div>

            <h1 className="text-5xl font-extrabold leading-[1.15] tracking-tight text-secondary md:text-6xl lg:text-7xl">
              Practice Hub
            </h1>

            <p className="mx-auto text-lg font-light leading-relaxed text-slate-500 md:text-xl">
              Elevate your engineering craft through structured roadmap-based
              learning. Choose a domain below to begin your technical mastery.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-16 lg:gap-24">
            <HeaderStat
              label="Learning Paths"
              value={tracks.length.toString()}
              icon={<Target className="h-4 w-4" />}
            />
          </div>

          <div className="mt-20 h-px w-full max-w-5xl bg-linear-to-r from-transparent via-slate-200 to-transparent" />
        </header>

        <section className="mb-24">
          <GatedTrackCards tracks={tracks} />
        </section>
      </div>
    </div>
  );
}

function HeaderStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group flex flex-col items-center gap-1.5 text-center">
      <div className="flex items-center justify-center gap-2 text-slate-400 transition-colors group-hover:text-primary">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-widest">
          {label}
        </span>
      </div>
      <span className="text-3xl font-extrabold tracking-tight text-slate-800">
        {value}
      </span>
    </div>
  );
}
