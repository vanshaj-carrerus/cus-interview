"use client";

import { Bell } from "lucide-react";
import { useDashboardNotifications } from "./dashboard-notifications-context";

type Props = {
  className?: string;
};

export default function DashboardNotificationButton({ className = "" }: Props) {
  const { openNotifications } = useDashboardNotifications();

  return (
    <button
      type="button"
      aria-label="Notifications"
      title="Notifications"
      onClick={openNotifications}
      className={`flex h-10 w-10 items-center justify-center rounded-full text-secondary/70 transition hover:bg-slate-50 hover:text-secondary ${className}`}
    >
      <Bell className="h-5 w-5" strokeWidth={1.75} />
    </button>
  );
}
