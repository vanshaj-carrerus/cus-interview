import { Code2, type LucideIcon } from "lucide-react";

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
  completed: number;
  total: number;
  unitLabel?: string;
  icon?: LucideIcon;
  emptyMessage?: string;
  filledMessage?: string;
};

export default function YourProgressCard({
  completed,
  total,
  unitLabel = "solved",
  icon: Icon = Code2,
  emptyMessage = "Start your learning journey today.",
  filledMessage = "Keep going — consistency builds mastery.",
}: Props) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <aside className="h-fit lg:sticky lg:top-6">
      <div className="rounded-xl border border-primary/15 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-secondary">Your Progress</h2>
          <Icon className="h-5 w-5 text-primary/60" />
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="relative flex items-center justify-center">
            <ProgressRing percent={percent} />
            <span className="absolute text-lg font-bold text-secondary">{percent}%</span>
          </div>
          <p className="mt-3 text-sm font-semibold text-secondary">
            {completed}{" "}
            <span className="font-normal text-secondary/50">
              / {total} {unitLabel}
            </span>
          </p>
          <p className="mt-1 text-xs text-secondary/50">
            {completed > 0 ? filledMessage : emptyMessage}
          </p>
        </div>
      </div>
    </aside>
  );
}
