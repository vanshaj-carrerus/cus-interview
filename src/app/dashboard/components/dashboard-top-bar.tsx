"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, CreditCard, LogOut } from "lucide-react";
import UserAvatar from "@/components/user/UserAvatar";
import { useAuth } from "@/components/providers/auth-provider";
import { getClientAvatarCandidates } from "@/lib/user-avatar";
import DashboardNotificationButton from "./dashboard-notification-button";

type Props = {
  className?: string;
};

export default function DashboardTopBar({ className = "" }: Props) {
  const { user, loading, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          title="Profile Menu"
          className="rounded-full transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          <UserAvatar
            name={displayName}
            email={user.email}
            avatarUrls={avatarUrls}
            className="h-9 w-9 border border-slate-200"
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-100 bg-white py-1 shadow-lg ring-1 ring-black/5 z-50">
            <Link
              href="/dashboard/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors"
            >
              <User className="h-4 w-4" />
              Profile
            </Link>
            <div className="my-1 border-t border-slate-100" />
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
