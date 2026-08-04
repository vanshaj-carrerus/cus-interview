"use client";

import { useEffect } from "react";
import { Bell, X } from "lucide-react";
import { useDashboardNotifications } from "./dashboard-notifications-context";

export default function DashboardNotificationsPanel() {
  const { open, closeNotifications } = useDashboardNotifications();

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeNotifications();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, closeNotifications]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        aria-label="Close notifications"
        className="absolute inset-0 bg-black/40 transition-opacity"
        onClick={closeNotifications}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="dashboard-notifications-title"
        className="dashboard-notifications-panel absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col border-l border-slate-200 bg-white shadow-[-8px_0_30px_rgba(15,23,42,0.08)]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div>
            <h2
              id="dashboard-notifications-title"
              className="text-xl font-bold tracking-tight text-secondary"
            >
              Notifications
            </h2>
            <p className="mt-1 text-sm text-secondary/50">You&apos;re all caught up</p>
          </div>
          <button
            type="button"
            aria-label="Close notifications panel"
            onClick={closeNotifications}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-secondary/60 transition hover:bg-slate-50 hover:text-secondary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <Bell className="h-7 w-7 text-secondary/35" strokeWidth={1.5} />
          </div>
          <p className="text-lg font-bold text-secondary">You&apos;re all caught up</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-secondary/50">
            New notifications will appear here.
          </p>
        </div>
      </aside>
    </div>
  );
}
