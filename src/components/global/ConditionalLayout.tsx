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
  
  // Define routes where header and footer should be hidden
  const isTestRoute = 
    pathname?.includes("/ai-mock") || 
    pathname?.includes("/step-") || 
    pathname?.includes("/interview-session");

  return (
    <>
      {!isTestRoute && header}
      <div className={`flex ${!isTestRoute ? 'pt-24' : ''} min-h-screen flex-col`}>
        <main className="flex-1">{children}</main>
        {!isTestRoute && footer}
      </div>
    </>
  );
}
