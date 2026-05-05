"use client";

import { useEffect, useState } from "react";
import type { AttemptTableSortField, LearningAttemptTableRowDto } from "@/types/learning/progress";
import { logLearningProgress } from "@/lib/learning-progress-debug";

function formatAttemptUtcLabel(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  })} UTC`;
}

type SortDir = "asc" | "desc";

const COLUMNS: { field: AttemptTableSortField; label: string }[] = [
  { field: "attemptedAt", label: "When (UTC)" },
  { field: "entityType", label: "Type" },
  { field: "levelNumber", label: "Level" },
  { field: "outcome", label: "Outcome" },
  { field: "isCorrect", label: "Correct" },
];

export function ProfileRecentAttemptsTable() {
  const [items, setItems] = useState<LearningAttemptTableRowDto[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [sort, setSort] = useState<AttemptTableSortField>("attemptedAt");
  const [dir, setDir] = useState<SortDir>("desc");
  const [qInput, setQInput] = useState("");
  const [q, setQ] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      setQ(qInput.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [qInput]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          page: String(page),
          pageSize: String(pageSize),
          sort,
          dir,
          q,
        });
        const res = await fetch(`/api/learning/me/attempts?${params}`, {
          credentials: "include",
          cache: "no-store",
        });
        const data = (await res.json()) as {
          items?: LearningAttemptTableRowDto[];
          total?: number;
          error?: string;
        };
        logLearningProgress("profile-attempts-table", "GET /api/learning/me/attempts", {
          status: res.status,
          ok: res.ok,
          total: data.total,
          itemCount: Array.isArray(data.items) ? data.items.length : 0,
          error: data.error,
        });
        if (!res.ok) throw new Error(data.error ?? "Failed to load");
        if (!cancelled) {
          setItems(Array.isArray(data.items) ? data.items : []);
          setTotal(typeof data.total === "number" ? data.total : 0);
        }
      } catch {
        if (!cancelled) {
          setError("Could not load attempts.");
          setItems([]);
          setTotal(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [page, pageSize, sort, dir, q]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  function onHeaderClick(field: AttemptTableSortField) {
    if (sort === field) {
      setDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSort(field);
      setDir(field === "attemptedAt" ? "desc" : "asc");
    }
    setPage(1);
  }

  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-4">
        <h2 className="text-lg font-black text-secondary">Recent attempts</h2>
        <label className="block w-full sm:max-w-xs">
          <span className="sr-only">Search attempts</span>
          <input
            type="search"
            value={qInput}
            onChange={(e) => setQInput(e.target.value)}
            placeholder="Search type, outcome, level, date…"
            className="w-full rounded-xl border border-secondary/15 bg-white px-3 py-2 text-sm text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/40"
            autoComplete="off"
          />
        </label>
      </div>

      {error ? (
        <p className="text-sm text-secondary rounded-2xl border border-secondary/10 bg-white p-6">{error}</p>
      ) : (
        <div className="rounded-2xl border border-secondary/10 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[520px]">
              <thead>
                <tr className="text-secondary/45 font-black uppercase tracking-widest bg-primary/5 border-b border-secondary/10">
                  {COLUMNS.map(({ field, label }) => (
                    <th key={field} className="text-left py-3 px-4">
                      <button
                        type="button"
                        onClick={() => onHeaderClick(field)}
                        className="inline-flex items-center gap-1.5 text-left font-black uppercase tracking-widest text-secondary/55 hover:text-secondary transition-colors"
                      >
                        {label}
                        {sort === field ? (
                          <span className="text-primary tabular-nums">{dir === "asc" ? "↑" : "↓"}</span>
                        ) : null}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-10 px-4 text-center text-secondary/50">
                      Loading…
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 px-4 text-center text-secondary/55">
                      No attempts match your filters.
                    </td>
                  </tr>
                ) : (
                  items.map((row, i) => (
                    <tr key={`${page}-${i}-${row.attemptedAt}`} className="border-b border-secondary/5 text-secondary">
                      <td className="py-2.5 px-4 whitespace-nowrap">{formatAttemptUtcLabel(row.attemptedAt)}</td>
                      <td className="py-2.5 px-4">{row.entityType}</td>
                      <td className="py-2.5 px-4 tabular-nums">{row.levelNumber}</td>
                      <td className="py-2.5 px-4">{row.outcome}</td>
                      <td className="py-2.5 px-4">{row.isCorrect ? "Yes" : "No"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-secondary/10 bg-secondary/3 px-4 py-3 text-xs text-secondary">
            <p className="text-secondary/55">
              <span className="font-bold text-secondary tabular-nums">{total}</span> total
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-secondary/15 px-3 py-1.5 font-bold text-secondary hover:bg-primary/10 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                Previous
              </button>
              <span className="tabular-nums text-secondary/70 px-1">
                Page <span className="font-black text-secondary">{page}</span> / {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages || loading}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-secondary/15 px-3 py-1.5 font-bold text-secondary hover:bg-primary/10 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
