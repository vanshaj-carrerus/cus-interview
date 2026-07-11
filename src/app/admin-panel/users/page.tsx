import { getAdminUsers } from "@/lib/billing/admin-users";
import UsersView from "./users-view";

export default async function UsersPage() {
  const users = await getAdminUsers();
  return <UsersView users={users} />;
}
