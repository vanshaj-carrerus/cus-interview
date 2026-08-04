"use client";

import { usePathname } from "next/navigation";

export default function ConditionalLayout({
  header,
  footer,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isFullPageRoute =
    pathname?.startsWith("/admin-panel") ||
    pathname?.startsWith("/dashboard") ||
    pathname?.includes("/ai-mock") ||
    pathname?.includes("/step-") ||
    pathname?.includes("/interview-session");

  return (
    <>
      {!isFullPageRoute && header}
      <div className={`flex ${!isFullPageRoute ? "pt-16" : ""} min-h-screen flex-col`}>
        <main className="flex-1">{children}</main>
        {!isFullPageRoute && footer}
      </div>
    </>
  );
}
