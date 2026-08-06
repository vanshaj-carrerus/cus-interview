import { Layers } from "lucide-react";

function ProgressRing({ percent }: { percent: number }) {
  const size = 88;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.min(100, Math.max(0, percent)) / 100);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#4ba3e3"
        strokeWidth={stroke}
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  );
}

type Props = {
  completedModules: number;
  totalModules: number;
};

export default function ProgrammingLanguagesProgressCard({
  completedModules,
  totalModules,
}: Props) {
  const percent = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  return (
    <aside className="h-fit lg:sticky lg:top-6">
      <div className="rounded-xl border border-primary/15 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-secondary">Your Progress</h2>
          <Layers className="h-5 w-5 text-primary/60" />
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="relative flex items-center justify-center">
            <ProgressRing percent={percent} />
            <span className="absolute text-lg font-bold text-secondary">{percent}%</span>
          </div>

          <p className="mt-3 text-sm font-semibold text-secondary">
            {completedModules}{" "}
            <span className="font-normal text-secondary/50">
              / {totalModules} levels
            </span>
          </p>

          <div className="mt-4 w-full">
            <div className="mb-1.5 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-secondary/45">
              <span>Language levels</span>
              <span className="text-secondary/70">{percent}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          {totalModules > 0 && totalModules <= 24 ? (
            <div className="mt-3 flex flex-wrap justify-center gap-1">
              {Array.from({ length: totalModules }).map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 w-3 rounded-full transition-colors ${index < completedModules ? "bg-primary" : "bg-slate-100"
                    }`}
                />
              ))}
            </div>
          ) : null}

          <p className="mt-3 text-xs text-secondary/50">
            {completedModules > 0
              ? "Keep going — consistency builds mastery."
              : "Complete a language quiz module to start tracking progress."}
          </p>
        </div>
      </div>
    </aside>
  );
}
