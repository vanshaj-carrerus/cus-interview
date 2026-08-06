"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import Logo from "@/components/global/Logo";
import SidebarLink from "./sidebar-link";

type NavItem = { slug: string; title: string };

type Props = {
  tracks: NavItem[];
  courses: NavItem[];
};

type SidebarTab = "manage" | "content";

function isContentRoute(pathname: string): boolean {
  const trackDetail = /^\/admin-panel\/learning-tracks\/[^/]+/.test(pathname);
  const courseDetail = /^\/admin-panel\/courses\/[^/]+/.test(pathname);
  return trackDetail || courseDetail;
}

export default function AdminSidebar({ tracks, courses }: Props) {
  const pathname = usePathname() ?? "";
  const defaultTab: SidebarTab = isContentRoute(pathname) ? "content" : "manage";
  const [tab, setTab] = useState<SidebarTab>(defaultTab);

  const activeTab = useMemo(() => {
    if (isContentRoute(pathname)) return "content";
    return tab;
  }, [pathname, tab]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-primary/10 p-4">
        <div className="mb-4">
          <Logo />
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-secondary">Admin Panel</h1>
          <Link href="/practice" className="text-xs text-primary hover:underline">
            Back
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-1 rounded-lg bg-primary/[0.06] p-1">
          <button
            type="button"
            onClick={() => setTab("manage")}
            className={`rounded-md px-3 py-2 text-xs font-semibold transition ${
              activeTab === "manage"
                ? "bg-white text-primary shadow-sm"
                : "text-secondary/60 hover:text-secondary"
            }`}
          >
            Manage
          </button>
          <button
            type="button"
            onClick={() => setTab("content")}
            className={`rounded-md px-3 py-2 text-xs font-semibold transition ${
              activeTab === "content"
                ? "bg-white text-primary shadow-sm"
                : "text-secondary/60 hover:text-secondary"
            }`}
          >
            Content
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4">
        {activeTab === "manage" ? (
          <>
            <section>
              <p className="mb-2 text-xs uppercase tracking-wider text-primary">Overview</p>
              <div className="space-y-1">
                <SidebarLink href="/admin-panel" label="Dashboard" />
              </div>
            </section>

            <section>
              <p className="mb-2 text-xs uppercase tracking-wider text-primary">Manage</p>
              <div className="space-y-1">
                <SidebarLink href="/admin-panel/learning-tracks" label="Practice Problems" />
                <SidebarLink href="/admin-panel/courses" label="Courses" />
                <SidebarLink href="/admin-panel/users" label="Users" />
                <SidebarLink href="/admin-panel/subscribers" label="Subscribers" />
                <SidebarLink href="/admin-panel/projects" label="Projects" />
              </div>
            </section>
          </>
        ) : (
          <>
            <section>
              <p className="mb-2 text-xs uppercase tracking-wider text-primary">Practice Sheets</p>
              <div className="space-y-1">
                {tracks.length === 0 ? (
                  <p className="px-3 py-2 text-xs text-secondary/50">No practice sheets yet.</p>
                ) : (
                  tracks.map((track) => (
                    <SidebarLink
                      key={track.slug}
                      href={`/admin-panel/learning-tracks/${track.slug}`}
                      label={track.title}
                    />
                  ))
                )}
              </div>
            </section>

            <section>
              <p className="mb-2 text-xs uppercase tracking-wider text-primary">Course Pages</p>
              <div className="space-y-1">
                {courses.length === 0 ? (
                  <p className="px-3 py-2 text-xs text-secondary/50">No course pages yet.</p>
                ) : (
                  courses.map((course) => (
                    <SidebarLink
                      key={course.slug}
                      href={`/admin-panel/courses/${course.slug}`}
                      label={course.title}
                    />
                  ))
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
