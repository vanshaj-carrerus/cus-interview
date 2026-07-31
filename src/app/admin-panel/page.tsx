import { getAdminDashboardStats } from "@/lib/billing/admin-dashboard";
import DashboardView from "./dashboard-view";

export const dynamic = "force-dynamic";

export default async function AdminPanelPage() {
  const stats = await getAdminDashboardStats();
  return <DashboardView stats={stats} />;
}
