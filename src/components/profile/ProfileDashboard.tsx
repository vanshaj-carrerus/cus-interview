import Link from "next/link";
import { UserRound } from "lucide-react";
import type { ProfileDashboardModel } from "@/lib/profile/profile-dashboard-model";
import { ProfileRecentAttemptsTable } from "@/components/profile/ProfileRecentAttemptsTable";

function RingChart({
  percent,
  size,
  stroke,
  arcClassName,
}: {
  percent: number;
  size: number;
  stroke: number;
  arcClassName: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const p = Math.min(100, Math.max(0, percent));
  const offset = c * (1 - p / 100);
  const cx = size / 2;
  const cy = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90 shrink-0">
      <defs>
        <linearGradient id="ring-gradient-sky" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="ring-gradient-pink" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        strokeWidth={stroke}
        className="text-slate-100"
        stroke="currentColor"
      />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        strokeWidth={stroke}
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className={arcClassName}
        stroke="currentColor"
      />
    </svg>
  );
}

function heatmapCellClass(level: 0 | 1 | 2 | 3 | 4): string {
  switch (level) {
    case 0:
      return "bg-slate-100/80";
    case 1:
      return "bg-sky-200 hover:bg-sky-300";
    case 2:
      return "bg-sky-400 hover:bg-sky-500";
    case 3:
      return "bg-sky-500 hover:bg-sky-600";
    default:
      return "bg-sky-600 hover:bg-sky-700 shadow-sm shadow-sky-200";
  }
}

function utcDateKeyToCalendarLabel(dateKey: string): string {
  const d = new Date(`${dateKey}T12:00:00.000Z`);
  if (Number.isNaN(d.getTime())) return dateKey;
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function heatmapDayTitle(cell: { dateKey: string; count: number; level: 0 | 1 | 2 | 3 | 4 }): string {
  const when = utcDateKeyToCalendarLabel(cell.dateKey);
  if (cell.count === 0) {
    return `${when} (UTC) — No attempts`;
  }
  const n = cell.count;
  const attemptsLabel = n === 1 ? "1 attempt" : `${n} attempts`;
  return `${when} (UTC) — ${attemptsLabel} (intensity ${cell.level}/4)`;
}

function dailyAttemptPointTitle(day: {
  dateKey: string;
  weekdayLabel: string;
  attempts: number;
}): string {
  const cal = utcDateKeyToCalendarLabel(day.dateKey);
  const a = day.attempts;
  const attemptsLabel = a === 0 ? "No attempts" : a === 1 ? "1 attempt" : `${a} attempts`;
  return `${day.weekdayLabel}, ${cal} (UTC) — ${attemptsLabel}`;
}

export function ProfileDashboard({ model }: { model: ProfileDashboardModel }) {
  const { user, heatmap } = model;
  const attemptDays = model.dailyAttemptDays;
  const maxDaily = Math.max(1, ...attemptDays.map((d) => d.attempts));
  const chartH = 150;
  const chartW = 320;
  const pad = 12;
  const nPts = attemptDays.length;
  const pts = attemptDays
    .map((row, i) => {
      const x = pad + (i * (chartW - pad * 2)) / Math.max(1, nPts - 1);
      const y = chartH - pad - (row.attempts / maxDaily) * (chartH - pad * 2);
      return `${x},${y}`;
    })
    .join(" ");

  const strengthMax = Math.max(1, ...model.trackBars.map((t) => t.cleared));

  return (
    <div className="relative min-h-[calc(100vh-5rem)] pb-16 bg-white overflow-hidden font-sans text-slate-800">

      <div className="max-w-7xl mt-4 mx-auto px-4 sm:px-6 py-6 lg:py-8 relative z-10">
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight mb-18">
          Welcome, <span className="text-sky-600 ">{user.displayName || "User"}</span>
        </h1>

       

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 min-w-0 space-y-8">
            
            {/* STAT TILES */}
            <section>
              <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
                <h2 className="text-lg md:text-xl font-black text-slate-800 ">Learning Totals</h2>
                {model.lastActiveAtLabel ? (
                  <p className="text-xs font-medium text-slate-500  px-3 py-1 rounded-full  ">
                    Last activity: <span className="font-bold text-sky-500">{model.lastActiveAtLabel}</span>
                  </p>
                ) : null}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {model.statTiles.map((row) => (
                  <div
                    key={row.label}
                    className="rounded-2xl border border-slate-100 bg-white/80 backdrop-blur-md p-5   transition-all group"
                  >
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 leading-tight">
                      {row.label}
                    </p>
                    <p className="text-2xl font-black text-slate-800 mt-1 tabular-nums group-hover:bg-gradient-to-br group-hover:from-sky-500 group-hover:to-sky-600 group-hover:bg-clip-text ">{row.value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ATTEMPTS HEATMAP ROW */}
                



            {/* TRACK BARS */}
            {model.trackBars.length > 0 ? (
              <section className="mt-16">
                <h2 className="text-base font-bold text-slate-800 mb-4">Clears by track</h2>
                <div className="space-y-4 border-.5  rounded-2xl p-4 bg-slate-50 ">
                  {model.trackBars.map((t) => (
                    <div key={t.label}>
                      <div className="flex justify-between text-sm mb-1.5 gap-3">
                        <span className="font-medium text-slate-700 truncate">{t.label}</span>
                        <span className="text-slate-500 shrink-0 tabular-nums">{t.cleared} clears</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-sky-500 transition-all duration-1000"
                          style={{
                            width: `${Math.min(100, Math.round((t.cleared / strengthMax) * 100))}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {/* RECENT ATTEMPTS TABLE */}
            <div className="pt-4">
              <ProfileRecentAttemptsTable />
            </div>

          </div>
        </div>
      </div>
    
  );
}
