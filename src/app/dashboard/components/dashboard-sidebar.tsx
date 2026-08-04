"use client";

import Link from "next/link";
import {
  Bot,
  Briefcase,
  Code2,
  FileSearch,
  FolderKanban,
  GraduationCap,
  Home,
  LayoutDashboard,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Terminal,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import DashboardSidebarLink from "./dashboard-sidebar-link";
import DashboardSidebarLogo from "./dashboard-sidebar-logo";
import { SidebarAnimatedText } from "./sidebar-animated-label";
import { useDashboardSidebar } from "./dashboard-sidebar-context";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/practice-problems", label: "Practice Problems", icon: Code2 },
  { href: "/dashboard/programming-languages", label: "Programming Languages", icon: GraduationCap },
  { href: "/dashboard/ai-mock-interview", label: "AI Mock Interview", icon: Bot },
  { href: "/dashboard/compiler", label: "Compiler", icon: Terminal },
  { href: "/dashboard/resume-analyzer", label: "Resume Analyzer", icon: FileSearch },
  { href: "/dashboard/company-interviews", label: "Company Interview Que", icon: Briefcase },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
];

type Props = {
  guest?: boolean;
  forceExpanded?: boolean;
};

function SidebarToggleButton() {
  const { collapsed, toggleCollapsed } = useDashboardSidebar();

  return (
    <button
      type="button"
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      onClick={toggleCollapsed}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-sky-400/25 text-sky-100/70 hover:border-sky-400/45 hover:bg-sky-400/10 hover:text-white"
    >
      {collapsed ? (
        <PanelLeftOpen className="h-4 w-4" />
      ) : (
        <PanelLeftClose className="h-4 w-4" />
      )}
    </button>
  );
}

function FooterLink({
  href,
  label,
  icon: Icon,
  onClick,
  collapsed,
  index = 0,
}: {
  href?: string;
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  collapsed: boolean;
  index?: number;
}) {
  const className = `flex items-center rounded-lg text-[13px] text-sky-100/60 hover:bg-sky-400/10 hover:text-white ${
    collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5"
  }`;

  const content = (
    <>
      <Icon className="h-4 w-4 shrink-0" />
      <SidebarAnimatedText label={label} collapsed={collapsed} index={index} />
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        title={collapsed ? label : undefined}
        className={`w-full ${className}`}
      >
        {content}
      </button>
    );
  }

  return (
    <Link href={href ?? "/"} title={collapsed ? label : undefined} className={className}>
      {content}
    </Link>
  );
}

export default function DashboardSidebar({ guest = false, forceExpanded = false }: Props) {
  const { logout } = useAuth();
  const { collapsed: sidebarCollapsed } = useDashboardSidebar();
  const collapsed = forceExpanded ? false : sidebarCollapsed;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#0b1f3a]">
      <div className={`shrink-0 border-b border-sky-400/10 ${collapsed ? "px-3 py-4" : "px-4 py-4"}`}>
        <div
          className={`flex items-center ${collapsed ? "flex-col gap-3" : "justify-between gap-3"}`}
        >
          <DashboardSidebarLogo collapsed={collapsed} />
          <SidebarToggleButton />
        </div>
      </div>

      <nav
        className={`min-h-0 flex-1 space-y-0.5 overflow-x-hidden overflow-y-auto py-4 ${
          collapsed ? "px-2" : "px-3"
        }`}
      >
        {navItems.map((item, index) => (
          <DashboardSidebarLink
            key={item.href}
            {...item}
            collapsed={collapsed}
            index={index}
          />
        ))}
      </nav>

      <div
        className={`shrink-0 space-y-0.5 border-t border-sky-400/10 py-4 ${
          collapsed ? "px-2" : "px-3"
        }`}
      >
        {!guest ? (
          <>
            <FooterLink
              href="/profile"
              label="Profile"
              icon={UserRound}
              collapsed={collapsed}
              index={0}
            />
            <FooterLink
              label="Logout"
              icon={LogOut}
              onClick={() => logout()}
              collapsed={collapsed}
              index={1}
            />
          </>
        ) : null}
        <FooterLink
          href="/"
          label="Back to Home"
          icon={Home}
          collapsed={collapsed}
          index={guest ? 0 : 2}
        />
      </div>
    </div>
  );
}
