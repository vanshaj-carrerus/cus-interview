import Link from "next/link";
import { UserRound } from "lucide-react";
import type { ProfileDashboardModel } from "@/lib/profile/profile-dashboard-model";

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
      return "bg-slate-100";
    case 1:
      return "bg-primary/25";
    case 2:
      return "bg-primary/45";
    case 3:
      return "bg-primary/70";
    default:
      return "bg-primary";
  }
}

export function ProfileDashboard({ model }: { model: ProfileDashboardModel }) {
  const { user, heatmap } = model;
  const maxDaily = Math.max(1, ...model.dailyAttempts);
  const chartH = 120;
  const chartW = 280;
  const pad = 8;
  const pts = model.dailyAttempts
    .map((v, i) => {
      const x = pad + (i * (chartW - pad * 2)) / Math.max(1, model.dailyAttempts.length - 1);
      const y = chartH - pad - (v / maxDaily) * (chartH - pad * 2);
      return `${x},${y}`;
    })
    .join(" ");

  const strengthMax = Math.max(1, ...model.trackBars.map((t) => t.cleared));

  return (
    <div className="bg-slate-50/80 min-h-[calc(100vh-5rem)] pb-16">
      <div className="max-w-7xl md:container mx-auto px-4 sm:px-6 py-8 lg:py-10">
        <h1 className="text-2xl font-black text-secondary tracking-tight mb-8">Your profile</h1>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          <aside className="w-full lg:w-72 shrink-0">
            <div className="rounded-2xl border border-secondary/10 bg-white p-6 shadow-sm sticky top-24">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-secondary/5 border border-secondary/10 flex items-center justify-center text-secondary mb-4">
                  <UserRound className="w-10 h-10" strokeWidth={1.5} />
                </div>
                <p className="text-lg font-black text-secondary tracking-tight">{user.displayName}</p>
                <p className="text-xs text-secondary/60 break-all mt-1">{user.email}</p>
                <dl className="mt-4 w-full text-left space-y-2 text-xs border-t border-secondary/10 pt-4">
                  <div className="flex justify-between gap-2">
                    <dt className="text-secondary/50">Joined</dt>
                    <dd className="font-bold text-secondary">{user.accountCreatedLabel}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </aside>

          <div className="flex-1 min-w-0 space-y-10">
            <section>
              <h2 className="text-lg font-black text-secondary mb-4">Learning totals</h2>
              <p className="text-sm text-secondary/60 mb-4">
                From your stored learning profile{" "}
                {model.lastActiveAtLabel ? (
                  <>
                    · Last activity{" "}
                    <span className="font-semibold text-secondary">{model.lastActiveAtLabel}</span>
                  </>
                ) : null}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {model.statTiles.map((row) => (
                  <div
                    key={row.label}
                    className="rounded-2xl border border-secondary/10 bg-white p-4 shadow-sm"
                  >
                    <p className="text-[9px] font-black uppercase tracking-widest text-secondary/45 leading-tight">
                      {row.label}
                    </p>
                    <p className="text-xl font-black text-secondary mt-1 tabular-nums">{row.value}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black text-secondary mb-4">Attempts (last 7 UTC days)</h2>
              <div className="rounded-2xl border border-secondary/10 bg-white p-6 shadow-sm">
                <div className="w-full overflow-x-auto">
                  <svg
                    width={chartW}
                    height={chartH}
                    viewBox={`0 0 ${chartW} ${chartH}`}
                    className="text-secondary/30"
                  >
                    <polyline
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      className="text-primary"
                      points={pts}
                    />
                    {model.dailyAttempts.map((v, i) => {
                      const x = pad + (i * (chartW - pad * 2)) / Math.max(1, model.dailyAttempts.length - 1);
                      const y = chartH - pad - (v / maxDaily) * (chartH - pad * 2);
                      return <circle key={i} cx={x} cy={y} r={4} className="fill-primary" />;
                    })}
                  </svg>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-secondary/40 uppercase tracking-widest mt-2 px-1">
                  {model.weekLabels.map((d, i) => (
                    <span key={`${d}-${i}`}>{d}</span>
                  ))}
                </div>
              </div>
            </section>

            <section>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h2 className="text-lg font-black text-secondary">Activity heatmap</h2>
                <Link
                  href="/practice"
                  className="text-xs font-black uppercase tracking-widest text-primary hover:text-secondary transition-colors"
                >
                  Open practice
                </Link>
              </div>
              <div className="rounded-2xl border border-secondary/10 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap gap-6 text-sm mb-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-secondary/40">
                      Submissions {heatmap.year}
                    </p>
                    <p className="font-black text-secondary text-lg tabular-nums">{heatmap.submissionsYear}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-secondary/40">
                      Active days ({heatmap.year})
                    </p>
                    <p className="font-black text-secondary text-lg tabular-nums">{heatmap.activeDaysYear}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-secondary/40">
                      Best streak
                    </p>
                    <p className="font-black text-secondary text-lg tabular-nums">{heatmap.maxStreakDays}d</p>
                  </div>
                </div>
                <div className="flex gap-1 overflow-x-auto pb-2">
                  {heatmap.weeks.map((col, ci) => (
                    <div key={ci} className="flex flex-col gap-1">
                      {col.map((cell) => (
                        <div
                          key={cell.dateKey}
                          title={`${cell.dateKey}: ${cell.level ? "activity" : "none"}`}
                          className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-sm ${heatmapCellClass(cell.level)}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-4 text-[10px] text-secondary/45">
                  <span>Less</span>
                  {[0, 1, 2, 3, 4].map((lv) => (
                    <div
                      key={lv}
                      className={`w-3 h-3 rounded-sm ${heatmapCellClass(lv as 0 | 1 | 2 | 3 | 4)}`}
                    />
                  ))}
                  <span>More</span>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black text-secondary mb-4">Breakdown</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-secondary/10 bg-white p-6 shadow-sm flex flex-col items-center">
                  <h3 className="text-sm font-black text-secondary self-start mb-4 w-full">Question attempts</h3>
                  <div className="relative flex items-center justify-center">
                    <RingChart
                      percent={model.donutQuestionShare.arcPct}
                      size={160}
                      stroke={12}
                      arcClassName="text-primary"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                      <span className="text-3xl font-black text-secondary tabular-nums">
                        {model.donutQuestionShare.centerValue}
                      </span>
                      <span className="text-[10px] font-bold text-secondary/45 uppercase tracking-widest mt-1">
                        Questions
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-secondary/55 mt-4 text-center">{model.donutQuestionShare.caption}</p>
                </div>
                <div className="rounded-2xl border border-secondary/10 bg-white p-6 shadow-sm flex flex-col items-center">
                  <h3 className="text-sm font-black text-secondary self-start mb-4 w-full">Correct attempts</h3>
                  <div className="relative flex items-center justify-center">
                    <RingChart
                      percent={model.donutCorrect.arcPct}
                      size={160}
                      stroke={12}
                      arcClassName="text-secondary"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                      <span className="text-3xl font-black text-secondary tabular-nums">
                        {model.donutCorrect.centerValue}
                      </span>
                      <span className="text-[10px] font-bold text-secondary/45 uppercase tracking-widest mt-1">
                        Rate
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-secondary/55 mt-4 text-center">{model.donutCorrect.caption}</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black text-secondary mb-4">Progress by language &amp; track</h2>
              {model.languages.length === 0 ? (
                <p className="text-sm text-secondary/55 rounded-2xl border border-secondary/10 bg-white p-6">
                  No learning progress yet. Attempts on published roadmaps will appear here.
                </p>
              ) : (
                <div className="space-y-4">
                  {model.languages.map((lang) => (
                    <div
                      key={lang.languageSlug}
                      className="rounded-2xl border border-secondary/10 bg-white p-5 shadow-sm"
                    >
                      <div className="flex flex-wrap justify-between gap-2 mb-3">
                        <h3 className="font-black text-secondary">{lang.languageSlug}</h3>
                        <span className="text-xs text-secondary/55">
                          Attempts <span className="font-bold text-secondary">{lang.attempts}</span> · Cleared{" "}
                          <span className="font-bold text-secondary">{lang.cleared}</span>
                        </span>
                      </div>
                      {lang.tracks.length === 0 ? (
                        <p className="text-xs text-secondary/45">No tracks recorded for this language.</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs text-left min-w-[480px]">
                            <thead>
                              <tr className="text-secondary/45 font-black uppercase tracking-widest border-b border-secondary/10">
                                <th className="py-2 pr-3">Track</th>
                                <th className="py-2 pr-3">Levels done</th>
                                <th className="py-2 pr-3">Attempts</th>
                                <th className="py-2">Cleared</th>
                              </tr>
                            </thead>
                            <tbody>
                              {lang.tracks.map((t) => (
                                <tr key={t.trackSlug} className="border-b border-secondary/5 text-secondary">
                                  <td className="py-2 pr-3 font-semibold">{t.titleLabel}</td>
                                  <td className="py-2 pr-3 tabular-nums">
                                    {t.completedLevels}/{t.totalLevels}
                                  </td>
                                  <td className="py-2 pr-3 tabular-nums">{t.attempts}</td>
                                  <td className="py-2 tabular-nums">{t.cleared}</td>
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

            {model.trackBars.length > 0 ? (
              <section>
                <h2 className="text-lg font-black text-secondary mb-4">Clears by track (relative)</h2>
                <div className="rounded-2xl border border-secondary/10 bg-white p-6 shadow-sm space-y-4">
                  {model.trackBars.map((t) => (
                    <div key={t.label}>
                      <div className="flex justify-between text-xs mb-1.5 gap-2">
                        <span className="font-bold text-secondary truncate">{t.label}</span>
                        <span className="text-secondary/50 font-black shrink-0 tabular-nums">{t.cleared}</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary"
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

            <section>
              <h2 className="text-lg font-black text-secondary mb-4">Recent attempts</h2>
              {model.recentAttempts.length === 0 ? (
                <p className="text-sm text-secondary/55 rounded-2xl border border-secondary/10 bg-white p-6">
                  No recent attempts.
                </p>
              ) : (
                <div className="rounded-2xl border border-secondary/10 bg-white shadow-sm overflow-hidden overflow-x-auto">
                  <table className="w-full text-xs min-w-[520px]">
                    <thead>
                      <tr className="text-secondary/45 font-black uppercase tracking-widest bg-slate-50 border-b border-secondary/10">
                        <th className="text-left py-3 px-4">When (UTC)</th>
                        <th className="text-left py-3 px-4">Type</th>
                        <th className="text-left py-3 px-4">Level</th>
                        <th className="text-left py-3 px-4">Outcome</th>
                        <th className="text-left py-3 px-4">Correct</th>
                      </tr>
                    </thead>
                    <tbody>
                      {model.recentAttempts.map((row, i) => (
                        <tr key={`${row.attemptedAtIso}-${i}`} className="border-b border-secondary/5 text-secondary">
                          <td className="py-2.5 px-4 whitespace-nowrap">{row.attemptedAtLabel}</td>
                          <td className="py-2.5 px-4">{row.entityType}</td>
                          <td className="py-2.5 px-4 tabular-nums">{row.levelNumber}</td>
                          <td className="py-2.5 px-4">{row.outcome}</td>
                          <td className="py-2.5 px-4">{row.isCorrect ? "Yes" : "No"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
