"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import DashboardSidebar from "./dashboard-sidebar";
import DashboardAccessRequired from "./dashboard-access-required";
import DashboardSubscriptionRequired from "./dashboard-subscription-required";
import DashboardGuestHeader from "./dashboard-guest-header";
import DashboardTopBar from "./dashboard-top-bar";
import DashboardAuthModal from "./dashboard-auth-modal";
import DashboardNotificationsPanel from "./dashboard-notifications-panel";
import DashboardNotificationButton from "./dashboard-notification-button";
import UserAvatar from "@/components/user/UserAvatar";
import { useAuth } from "@/components/providers/auth-provider";
import { getClientAvatarCandidates } from "@/lib/user-avatar";
import { DashboardAuthModalProvider } from "./dashboard-auth-modal-provider";
import { useDashboardAuthModal } from "./dashboard-auth-modal-provider";
import {
  DashboardSidebarProvider,
  DASHBOARD_SIDEBAR_COLLAPSED_WIDTH,
  DASHBOARD_SIDEBAR_WIDTH,
  useDashboardSidebar,
} from "./dashboard-sidebar-context";
import { DashboardNotificationsProvider } from "./dashboard-notifications-context";

type Props = {
  children?: ReactNode;
  guest?: boolean;
};

function GuestMobileAuthButtons() {
  const { openLogin, openSignup } = useDashboardAuthModal();

  return (
    <div className="flex items-center gap-5">
      <button
        type="button"
        onClick={openLogin}
        className="text-sm font-semibold text-secondary transition-colors hover:text-primary"
      >
        Log in
      </button>
      <button
        type="button"
        onClick={openSignup}
        className="rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
      >
        Sign up
      </button>
    </div>
  );
}

function AuthenticatedMobileActions() {
  const { user } = useAuth();

  if (!user) return null;

  const displayName = user.name.trim() || user.email.split("@")[0] || "User";

  return (
    <div className="flex items-center gap-1">
      <DashboardNotificationButton />
      <Link
        href="/profile"
        title="Profile"
        className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
      >
        <UserAvatar
          name={displayName}
          email={user.email}
          avatarUrls={getClientAvatarCandidates(user.email, user.image)}
          className="h-9 w-9 border border-slate-200"
        />
      </Link>
    </div>
  );
}

function DashboardShellContent({ children, guest = false }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { collapsed } = useDashboardSidebar();
  const { user, loading } = useAuth();
  const sidebarWidth = collapsed ? DASHBOARD_SIDEBAR_COLLAPSED_WIDTH : DASHBOARD_SIDEBAR_WIDTH;

  const hasPlatformAccess = user?.role === "SuperAdmin" || Boolean(user?.subscription.hasPlatformAccess);
  const showSubscriptionRequired = !guest && !loading && user && !hasPlatformAccess;

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside
        className="dashboard-sidebar-panel fixed inset-y-0 left-0 z-40 hidden shrink-0 overflow-hidden lg:block"
        style={{ width: sidebarWidth }}
      >
        <DashboardSidebar guest={guest} />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-[260px] shadow-xl">
            <DashboardSidebar guest={guest} forceExpanded />
          </aside>
        </div>
      ) : null}

      <div
        className="dashboard-sidebar-panel shell-main flex min-h-screen min-w-0 flex-1 flex-col pt-14 lg:ml-[var(--dashboard-sidebar-width)] lg:pt-0"
        style={{ "--dashboard-sidebar-width": `${sidebarWidth}px` } as React.CSSProperties}
      >
        <div className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-surface px-4 backdrop-blur-sm lg:hidden">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-lg p-2 text-foreground transition hover:bg-surface-soft"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          {guest ? <GuestMobileAuthButtons /> : <AuthenticatedMobileActions />}
        </div>

        {guest ? <DashboardGuestHeader /> : <DashboardTopBar className="hidden lg:flex" />}

        <main
          className={
            guest || showSubscriptionRequired
              ? "flex flex-1 items-center justify-center bg-surface"
              : "flex-1 bg-background p-4 sm:p-6 lg:p-8"
          }
        >
          {guest ? <DashboardAccessRequired /> : showSubscriptionRequired ? <DashboardSubscriptionRequired /> : children}
        </main>
      </div>

      {guest ? <DashboardAuthModal /> : <DashboardNotificationsPanel />}
    </div>
  );
}

export default function DashboardShell(props: Props) {
  if (props.guest) {
    return (
      <DashboardAuthModalProvider>
        <DashboardSidebarProvider>
          <DashboardShellContent {...props} />
        </DashboardSidebarProvider>
      </DashboardAuthModalProvider>
    );
  }

  return (
    <DashboardSidebarProvider>
      <DashboardNotificationsProvider>
        <DashboardShellContent {...props} />
      </DashboardNotificationsProvider>
    </DashboardSidebarProvider>
  );
}
