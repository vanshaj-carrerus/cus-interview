import {
  getAdminPlatformSubscribers,
  getAdminServicePayments,
  getAdminSubscriberStats,
} from "@/lib/billing/admin-subscribers";
import SubscribersView from "./subscribers-view";

export default async function SubscribersPage() {
  const [platformRows, serviceRows, stats] = await Promise.all([
    getAdminPlatformSubscribers(),
    getAdminServicePayments(),
    getAdminSubscriberStats(),
  ]);

  return (
    <SubscribersView
      platformRows={platformRows}
      serviceRows={serviceRows}
      stats={stats}
    />
  );
}
