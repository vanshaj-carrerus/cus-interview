import { getAdminCoupons } from "@/lib/billing/admin-coupons";
import CouponsView from "./coupons-view";

export const dynamic = "force-dynamic";

export default async function CouponsPage() {
  const coupons = await getAdminCoupons();
  return <CouponsView coupons={coupons} />;
}
