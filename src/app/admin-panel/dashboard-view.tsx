import Link from "next/link";
import {
  ArrowRight,
  CreditCard,
  GraduationCap,
  Layers,
  Users,
} from "lucide-react";
import type { AdminDashboardStats } from "@/lib/billing/admin-dashboard";

type StatCard = {
  label: string;
  value: number;
  hint?: string;
  accent?: "primary" | "emerald" | "sky" | "amber";
};

function StatCard({ label, value, hint, accent = "primary" }: StatCard) {
  const accentClass =
    accent === "emerald"
      ? "border-emerald-200 bg-emerald-50/60"
      : accent === "sky"
        ? "border-sky-200 bg-sky-50/60"
        : accent === "amber"
          ? "border-amber-200 bg-amber-50/60"
          : "border-primary/15 bg-primary/[0.04]";

  return (
    <div className={`rounded-xl border px-4 py-4 ${accentClass}`}>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-primary">{label}</p>
      <p className="mt-1 text-3xl font-bold text-secondary">{value.toLocaleString()}</p>
      {hint ? <p className="mt-1 text-xs text-secondary/55">{hint}</p> : null}
    </div>
  );
}

type QuickLink = {
  href: string;
  label: string;
  description: string;
  icon: React.ReactNode;
};

function QuickLinkCard({ href, label, description, icon }: QuickLink) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-4 rounded-xl border border-primary/15 bg-white p-4 transition hover:border-primary/30 hover:bg-primary/[0.03]"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-secondary">{label}</h3>
          <ArrowRight className="h-4 w-4 shrink-0 text-secondary/30 transition group-hover:translate-x-0.5 group-hover:text-primary" />
        </div>
        <p className="mt-0.5 text-sm text-secondary/60">{description}</p>
      </div>
    </Link>
  );
}

export default function DashboardView({ stats }: { stats: AdminDashboardStats }) {
  const quickLinks: QuickLink[] = [
    {
      href: "/admin-panel/learning-tracks",
      label: "Practice Problems",
      description: `${stats.practiceTracks} tracks · ${stats.totalQuestions} questions`,
      icon: <Layers className="h-5 w-5" />,
    },
    {
      href: "/admin-panel/courses",
      label: "Courses",
      description: `${stats.courses} course pages`,
      icon: <GraduationCap className="h-5 w-5" />,
    },
    {
      href: "/admin-panel/users",
      label: "Users",
      description: `${stats.totalUsers} registered accounts`,
      icon: <Users className="h-5 w-5" />,
    },
    {
      href: "/admin-panel/subscribers",
      label: "Subscribers",
      description: `${stats.platformSubscribers} platform · ${stats.servicePayments} services`,
      icon: <CreditCard className="h-5 w-5" />,
    },
  ];

  return (
    <div className="min-w-0 space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-secondary">Dashboard</h2>
        <p className="mt-1 text-sm text-secondary/70">
          Overview of users, subscribers, and learning content.
        </p>
      </div>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-secondary/50">Users</h3>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total users" value={stats.totalUsers} accent="primary" />
          <StatCard
            label="Active users"
            value={stats.activeUsers}
            hint="Active in last 30 days"
            accent="emerald"
          />
          <StatCard
            label="New this month"
            value={stats.newUsersThisMonth}
            accent="sky"
          />
          <StatCard label="Super admins" value={stats.superAdmins} />
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-secondary/50">
          Subscribers
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Platform subscribers"
            value={stats.platformSubscribers}
            accent="primary"
          />
          <StatCard
            label="Active / trial"
            value={stats.activeSubscribers}
            accent="emerald"
          />
          <StatCard
            label="Service payments"
            value={stats.servicePayments}
            accent="amber"
          />
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-secondary/50">
          Content
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Practice tracks" value={stats.practiceTracks} />
          <StatCard label="Courses" value={stats.courses} />
          <StatCard label="Total questions" value={stats.totalQuestions} />
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-secondary/50">
          Quick access
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {quickLinks.map((link) => (
            <QuickLinkCard key={link.href} {...link} />
          ))}
        </div>
      </section>
    </div>
  );
}
