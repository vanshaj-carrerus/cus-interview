"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { SidebarAnimatedText } from "./sidebar-animated-label";

type Props = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  collapsed?: boolean;
  index?: number;
};

export default function DashboardSidebarLink({
  href,
  label,
  icon: Icon,
  exact,
  collapsed = false,
  index = 0,
}: Props) {
  const pathname = usePathname() ?? "";
  const active = exact
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={`flex items-center rounded-lg text-[13px] ${
        collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5"
      } ${
        active
          ? "bg-primary/20 font-medium text-white ring-1 ring-primary/30"
          : "text-sky-100/60 hover:bg-sky-400/10 hover:text-white"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <SidebarAnimatedText label={label} collapsed={collapsed} index={index} />
    </Link>
  );
}
