"use client";

import type { ReactNode } from "react";

type Props = {
  label: string;
  collapsed: boolean;
  className?: string;
};

export function SidebarLabel({ label, collapsed, className = "" }: Props) {
  if (collapsed) {
    return null;
  }

  return (
    <span title={label} className={`min-w-0 truncate ${className}`}>
     {label}
    </span>
  );
}

/** @deprecated Use SidebarLabel — kept for existing imports. */
export function SidebarAnimatedText({
  label,
  collapsed,
  className = "",
}: Props) {
  return <SidebarLabel label={label} collapsed={collapsed} className={className} />;
}

/** @deprecated Use SidebarLabel — kept for existing imports. */
export function SidebarAnimatedLabel({
  label,
  collapsed,
  children,
  className = "",
}: Props & { children: ReactNode }) {
  if (collapsed) {
    return null;
  }

  return (
    <span title={label} className={`inline-flex min-w-0 items-center overflow-hidden ${className}`}>
      {children}
    </span>
  );
}
