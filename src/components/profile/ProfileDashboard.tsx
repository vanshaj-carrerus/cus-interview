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
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
        <linearGradient id="ring-gradient-pink" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#fb7185" />
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
      return "bg-pink-300 hover:bg-pink-400";
    default:
      return "bg-pink-500 hover:bg-pink-600 shadow-sm shadow-pink-200";
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
    <div className="relative min-h-[calc(100vh-5rem)] pb-16 bg-gradient-to-br from-white via-sky-50 to-pink-50 overflow-hidden font-sans text-slate-800">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-sky-300/30 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-pink-300/30 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[10%] left-[10%] w-[700px] h-[700px] bg-purple-300/30 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] bg-emerald-300/20 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <div className="max-w-7xl md:container mx-auto px-4 sm:px-6 py-6 lg:py-8 relative z-10">
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight mb-8">
          Your <span className="bg-gradient-to-r from-sky-500 to-pink-500 bg-clip-text text-transparent">Profile</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          
          {/* LEFT SIDEBAR - USER CARD */}
          <aside className="w-full lg:w-[280px] shrink-0">
            <div className="rounded-[2rem] border border-slate-100 bg-white/80 backdrop-blur-xl p-6 shadow-xl shadow-sky-100/50 sticky top-24 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-100 to-pink-100 rounded-full blur-2xl opacity-50 -translate-y-1/2 translate-x-1/2 group-hover:opacity-80 transition-opacity" />
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-sky-400 to-pink-400 p-[3px] shadow-lg shadow-pink-200/50 mb-5 group-hover:scale-105 transition-transform">
                  <div className="w-full h-full bg-white rounded-[21px] flex items-center justify-center text-slate-800">
                    <UserRound className="w-10 h-10" strokeWidth={1.5} />
                  </div>
                </div>
                <p className="text-xl font-black text-slate-800 tracking-tight">{user.displayName}</p>
                <p className="text-xs font-medium text-slate-500 break-all mt-1">{user.email}</p>
                <dl className="mt-6 w-full text-left space-y-2 text-sm border-t border-slate-100 pt-5">
                  <div className="flex justify-between gap-2 items-center">
                    <dt className="text-slate-500 text-xs font-medium">Joined</dt>
                    <dd className="font-bold text-slate-800 text-xs bg-slate-50 px-3 py-1 rounded-full">{user.accountCreatedLabel}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 min-w-0 space-y-8">
            
            {/* STAT TILES */}
            <section>
              <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
                <h2 className="text-lg md:text-xl font-black text-slate-800">Learning Totals</h2>
                {model.lastActiveAtLabel ? (
                  <p className="text-xs font-medium text-slate-500 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
                    Last activity: <span className="font-bold text-sky-500">{model.lastActiveAtLabel}</span>
                  </p>
                ) : null}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {model.statTiles.map((row) => (
                  <div
                    key={row.label}
                    className="rounded-2xl border border-slate-100 bg-white/80 backdrop-blur-md p-5 shadow-sm hover:shadow-lg hover:shadow-sky-100/60 hover:-translate-y-1 transition-all group"
                  >
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 leading-tight">
                      {row.label}
                    </p>
                    <p className="text-2xl font-black text-slate-800 mt-1 tabular-nums group-hover:bg-gradient-to-br group-hover:from-sky-500 group-hover:to-pink-500 group-hover:bg-clip-text group-hover:text-transparent transition-all">{row.value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ATTEMPTS CHART & HEATMAP ROW */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* LINE CHART */}
              <section>
                <h2 className="text-lg font-black text-slate-800 mb-4">Attempts <span className="text-xs font-medium text-slate-400 ml-2">(last 7 UTC days)</span></h2>
                <div className="rounded-2xl border border-slate-100 bg-white/80 backdrop-blur-md p-6 shadow-sm hover:shadow-lg hover:shadow-sky-100/50 transition-all flex flex-col h-full justify-between">
                  <div className="w-full flex items-center justify-center flex-1">
                    <svg
                      width={chartW}
                      height={chartH}
                      viewBox={`0 0 ${chartW} ${chartH}`}
                      className="text-slate-100 overflow-visible"
                    >
                      <defs>
                        <linearGradient id="gradient-line" x1="0" y1="0" x2="100%" y2="0">
                          <stop offset="0%" stopColor="#38bdf8" />
                          <stop offset="100%" stopColor="#f472b6" />
                        </linearGradient>
                      </defs>
                      <polyline
                        fill="none"
                        stroke="url(#gradient-line)"
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="pointer-events-none drop-shadow-sm"
                        points={pts}
                      />
                      {attemptDays.map((day, i) => {
                        const x = pad + (i * (chartW - pad * 2)) / Math.max(1, nPts - 1);
                        const y = chartH - pad - (day.attempts / maxDaily) * (chartH - pad * 2);
                        return (
                          <g key={day.dateKey} className="group">
                            <title>{dailyAttemptPointTitle(day)}</title>
                            <circle cx={x} cy={y} r={14} className="fill-transparent cursor-default" />
                            <circle cx={x} cy={y} r={4} fill="#fff" strokeWidth={2.5} stroke="#f472b6" className="pointer-events-none group-hover:r-[6px] transition-all" />
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4 px-1">
                    {attemptDays.map((d) => (
                      <span key={d.dateKey} title={utcDateKeyToCalendarLabel(d.dateKey) + " (UTC)"}>
                        {d.weekdayLabel}
                      </span>
                    ))}
                  </div>
                </div>
              </section>

              {/* HEATMAP */}
              <section>
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <h2 className="text-lg font-black text-slate-800">Activity Heatmap</h2>
                  <Link
                    href="/practice"
                    className="text-[10px] bg-slate-100 px-3 py-1 rounded-full font-bold uppercase tracking-widest text-sky-500 hover:bg-sky-50 hover:text-sky-600 transition-colors shadow-sm"
                  >
                    Open practice
                  </Link>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white/80 backdrop-blur-md p-6 shadow-sm hover:shadow-lg hover:shadow-sky-100/50 transition-all h-full">
                  <div className="flex flex-wrap gap-5 text-sm mb-5 pb-5 border-b border-slate-100">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Level Days {heatmap.year}</p>
                      <p className="font-black text-slate-800 text-xl tabular-nums mt-1">{heatmap.levelPracticeDaysYear}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Active Days ({heatmap.year})</p>
                      <p className="font-black text-slate-800 text-xl tabular-nums mt-1">{heatmap.activeDaysYear}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Best Streak</p>
                      <p className="font-black text-emerald-500 text-xl tabular-nums mt-1">{heatmap.maxStreakDays}d</p>
                    </div>
                  </div>
                  <div className="flex gap-[5px] overflow-x-auto pb-2 scrollbar-hide">
                    {heatmap.weeks.map((col, ci) => (
                      <div key={ci} className="flex flex-col gap-[5px]">
                        {col.map((cell) => (
                          <div
                            key={cell.dateKey}
                            title={heatmapDayTitle(cell)}
                            className={`w-3.5 h-3.5 rounded-[3px] shrink-0 transition-colors ${heatmapCellClass(cell.level)}`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-4 text-[10px] font-medium text-slate-400">
                    <span>Less</span>
                    {[0, 1, 2, 3, 4].map((lv) => (
                      <div
                        key={lv}
                        className={`w-3.5 h-3.5 rounded-[3px] ${heatmapCellClass(lv as 0 | 1 | 2 | 3 | 4)}`}
                      />
                    ))}
                    <span>More</span>
                  </div>
                </div>
              </section>
            </div>

            {/* BREAKDOWN RING CHARTS */}
            <section>
              <h2 className="text-lg font-black text-slate-800 mb-4">Performance Breakdown</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="rounded-2xl border border-slate-100 bg-white/80 backdrop-blur-md p-6 shadow-sm hover:shadow-lg hover:shadow-sky-100/50 transition-all flex flex-col items-center">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 self-start mb-5">Question Share</h3>
                  <div className="relative flex items-center justify-center">
                    <RingChart
                      percent={model.donutQuestionShare.arcPct}
                      size={150}
                      stroke={12}
                      arcClassName="text-sky-400"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                      <span className="text-3xl font-black text-slate-800 tabular-nums">
                        {model.donutQuestionShare.centerValue}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        Questions
                      </span>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-slate-500 mt-5 text-center max-w-[16rem]">{model.donutQuestionShare.caption}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white/80 backdrop-blur-md p-6 shadow-sm hover:shadow-lg hover:shadow-pink-100/50 transition-all flex flex-col items-center">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 self-start mb-5">Correct Attempts</h3>
                  <div className="relative flex items-center justify-center">
                    <RingChart
                      percent={model.donutCorrect.arcPct}
                      size={150}
                      stroke={12}
                      arcClassName="text-pink-400"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                      <span className="text-3xl font-black text-slate-800 tabular-nums">
                        {model.donutCorrect.centerValue}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        Rate
                      </span>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-slate-500 mt-5 text-center max-w-[16rem]">{model.donutCorrect.caption}</p>
                </div>
              </div>
            </section>

            {/* PROGRESS BY LANGUAGE & TRACK */}
            <section>
              <h2 className="text-lg font-black text-slate-800 mb-4">Progress by Track</h2>
              {model.languages.length === 0 ? (
                <div className="rounded-2xl border border-slate-100 bg-white/80 backdrop-blur-md p-8 shadow-sm text-center">
                  <p className="text-sm text-slate-500 font-medium">
                    No learning progress yet. Your attempts on published roadmaps will appear here.
                  </p>
                  <Link href="/practice" className="inline-flex mt-3 text-xs font-bold text-sky-500 hover:text-sky-600 transition-colors">Start practicing →</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {model.languages.map((lang) => (
                    <div
                      key={lang.languageSlug}
                      className="rounded-2xl border border-slate-100 bg-white/80 backdrop-blur-md p-5 sm:p-6 shadow-sm hover:shadow-lg hover:shadow-sky-100/50 transition-all"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-100">
                        <h3 className="text-lg font-black text-slate-800 capitalize flex items-center gap-2">
                          <span className="w-7 h-7 rounded-md bg-sky-100 text-sky-500 flex items-center justify-center text-xs">{lang.languageSlug[0]}</span>
                          {lang.languageSlug}
                        </h3>
                        <div className="flex gap-3">
                          <div className="text-center px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Attempts</p>
                            <p className="text-sm font-black text-slate-800">{lang.attempts}</p>
                          </div>
                          <div className="text-center px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Cleared</p>
                            <p className="text-sm font-black text-emerald-500">{lang.cleared}</p>
                          </div>
                        </div>
                      </div>
                      {lang.tracks.length === 0 ? (
                        <p className="text-xs text-slate-500">No tracks recorded for this language.</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs text-left min-w-[500px]">
                            <thead>
                              <tr className="text-slate-400 font-bold uppercase tracking-widest">
                                <th className="py-2 px-3 bg-slate-50 rounded-l-lg">Track</th>
                                <th className="py-2 px-3 bg-slate-50">Levels done</th>
                                <th className="py-2 px-3 bg-slate-50">Attempts</th>
                                <th className="py-2 px-3 bg-slate-50 rounded-r-lg">Cleared</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                              {lang.tracks.map((t) => (
                                <tr key={t.trackSlug} className="group hover:bg-slate-50/50 transition-colors">
                                  <td className="py-3 px-3 font-bold text-slate-700">{t.titleLabel}</td>
                                  <td className="py-3 px-3 font-medium text-slate-500 tabular-nums">
                                    <span className="px-2 py-0.5 bg-sky-50 text-sky-600 rounded font-bold">{t.completedLevels}/{t.totalLevels}</span>
                                  </td>
                                  <td className="py-3 px-3 font-medium text-slate-500 tabular-nums">{t.attempts}</td>
                                  <td className="py-3 px-3 font-bold text-emerald-500 tabular-nums">{t.cleared}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* TRACK BARS */}
            {model.trackBars.length > 0 ? (
              <section>
                <h2 className="text-lg font-black text-slate-800 mb-4">Clears by track</h2>
                <div className="rounded-2xl border border-slate-100 bg-white/80 backdrop-blur-md p-6 shadow-sm hover:shadow-lg hover:shadow-sky-100/50 transition-all space-y-5">
                  {model.trackBars.map((t) => (
                    <div key={t.label} className="group">
                      <div className="flex justify-between text-xs mb-2 gap-3">
                        <span className="font-bold text-slate-700 truncate">{t.label}</span>
                        <span className="text-slate-500 font-bold shrink-0 tabular-nums">{t.cleared} clears</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-sky-400 to-pink-400 transition-all duration-1000 group-hover:from-sky-500 group-hover:to-pink-500"
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
    </div>
  );
}
