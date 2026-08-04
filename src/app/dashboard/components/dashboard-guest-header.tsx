"use client";

import DashboardAuthLinks from "./dashboard-auth-links";

export default function DashboardGuestHeader() {
  return (
    <header className="hidden h-16 shrink-0 items-center justify-end border-b border-slate-100 bg-white px-8 lg:flex">
      <DashboardAuthLinks
        loginClassName="text-sm font-semibold text-secondary transition-colors hover:text-primary"
        signupClassName="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
      />
    </header>
  );
}
