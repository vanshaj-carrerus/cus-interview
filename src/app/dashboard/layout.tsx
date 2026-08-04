import { ReactNode } from "react";
import DashboardShell from "./components/dashboard-shell";
import { getSessionPublicUser } from "@/lib/get-session-user";
import { connectDB } from "@/lib/mongodb";
import { recordUserLoginStreak } from "@/lib/login-streak";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getSessionPublicUser();

  if (!user) {
    return <DashboardShell guest />;
  }

  await connectDB();
  await recordUserLoginStreak(user.id);

  return <DashboardShell>{children}</DashboardShell>;
}
