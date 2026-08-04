"use client";

import Link from "next/link";
import Logo from "@/components/global/Logo";

const BRAND_LINES = [
  { text: "CUS", className: "text-[15px] font-bold tracking-wide text-white" },
  {
    text: "INTERVIEW",
    className: "text-[10px] font-semibold uppercase tracking-[0.22em] text-primary",
  },
] as const;

type Props = {
  collapsed: boolean;
  href?: string;
};

export default function DashboardSidebarLogo({ collapsed, href = "/dashboard" }: Props) {
  return (
    <Link
      href={href}
      title={collapsed ? "CUS Interview" : undefined}
      className={`inline-flex min-w-0 items-center ${collapsed ? "justify-center" : "gap-2.5"}`}
    >
      <Logo
        href={null}
        variant="icon"
        width={collapsed ? 40 : 34}
        height={collapsed ? 40 : 34}
        className="shrink-0"
      />

      {!collapsed ? (
        <div className="flex min-w-0 flex-col gap-1">
          {BRAND_LINES.map((line) => (
            <span key={line.text} className={`block leading-none ${line.className}`}>
              {line.text}
            </span>
          ))}
        </div>
      ) : null}
    </Link>
  );
}
