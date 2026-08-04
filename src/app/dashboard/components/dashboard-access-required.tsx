"use client";

import DashboardAuthLinks from "./dashboard-auth-links";

export default function DashboardAccessRequired() {
  return (
    <section className="w-full px-6 text-center">
      <div className="mx-auto w-full max-w-lg">
        <h1 className="text-4xl font-bold tracking-tight text-secondary sm:text-[2.75rem] sm:leading-tight">
          Access Required
        </h1>
        <p className="mx-auto mt-5 max-w-xs text-[15px] leading-relaxed text-slate-500 sm:max-w-sm sm:text-base">
          Please login to view your dashboard and track your progress
        </p>
        <DashboardAuthLinks className="mt-10" />
      </div>
    </section>
  );
}
