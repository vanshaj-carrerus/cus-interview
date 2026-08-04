"use client";

import type { ReactNode } from "react";

/** Immersive full-viewport layout within the dashboard (sidebar + top bar remain). */
export default function AiMockFullscreenLayout({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-0 top-14 z-10 flex flex-col overflow-hidden bg-slate-50 lg:left-[var(--dashboard-sidebar-width,240px)]">
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">{children}</div>
    </div>
  );
}
