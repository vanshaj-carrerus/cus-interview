"use client";

import Link from "next/link";
import UserAvatar from "@/components/user/UserAvatar";
import { useAuth } from "@/components/providers/auth-provider";
import { getClientAvatarCandidates } from "@/lib/user-avatar";
import DashboardNotificationButton from "./dashboard-notification-button";

type Props = {
  className?: string;
};

export default function DashboardTopBar({ className = "" }: Props) {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return (
      <header
        className={`sticky top-0 z-20 flex h-14 shrink-0 items-center justify-end border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8 ${className}`}
      >
        <div className="h-9 w-9 animate-pulse rounded-full bg-slate-100" />
      </header>
    );
  }

  const avatarUrls = getClientAvatarCandidates(user.email, user.image);
  const displayName = user.name.trim() || user.email.split("@")[0] || "User";

  return (
    <header
      className={`sticky top-0 z-20 flex h-14 shrink-0 items-center justify-end gap-2 border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8 ${className}`}
    >
      <DashboardNotificationButton />

      <Link
        href="/profile"
        title="Profile"
        className="rounded-full transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
      >
        <UserAvatar
          name={displayName}
          email={user.email}
          avatarUrls={avatarUrls}
          className="h-9 w-9 border border-slate-200"
        />
      </Link>
    </header>
  );
}
