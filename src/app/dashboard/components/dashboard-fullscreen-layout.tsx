"use client";

import type { ReactNode } from "react";

/** Full-viewport content area inside the dashboard (sidebar + top bar stay visible). */
export default function DashboardFullscreenLayout({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-0 top-14 z-10 flex flex-col overflow-hidden bg-slate-50 lg:left-[var(--dashboard-sidebar-width,240px)]">
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">{children}</div>
    </div>
  );
}
