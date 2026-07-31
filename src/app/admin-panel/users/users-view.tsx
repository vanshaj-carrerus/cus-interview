import type { AdminUserRecord } from "@/lib/billing/admin-users";

function StatusBadge({ label, tone }: { label: string; tone: string }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${tone}`}
    >
      {label}
    </span>
  );
}

function statusTone(status: string): string {
  switch (status) {
    case "pending":
      return "bg-violet-100 text-violet-700";
    case "trialing":
      return "bg-sky-100 text-sky-700";
    case "active":
      return "bg-emerald-100 text-emerald-700";
    case "past_due":
      return "bg-amber-100 text-amber-700";
    case "failed":
      return "bg-red-100 text-red-700";
    case "canceled":
      return "bg-slate-100 text-slate-600";
    default:
      return "bg-slate-100 text-slate-500";
  }
}

export default function UsersView({ users }: { users: AdminUserRecord[] }) {
  return (
    <div className="min-w-0 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-secondary">Users</h2>
        <p className="mt-1 text-sm text-secondary/70">
          Badha registered / login users — read-only view.
        </p>
        <p className="mt-1 text-xs text-secondary/50">{users.length} total users</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-primary/15">
        <table className="w-full min-w-[1000px] text-left">
          <thead>
            <tr className="border-b border-primary/10 bg-primary/[0.04] text-[10px] font-semibold uppercase tracking-wider text-secondary/55">
              <th className="px-3 py-3">Name</th>
              <th className="px-3 py-3">Email</th>
              <th className="px-3 py-3">Mobile</th>
              <th className="px-3 py-3">Role</th>
              <th className="px-3 py-3">Joined</th>
              <th className="px-3 py-3">Days</th>
              <th className="px-3 py-3">Plan</th>
              <th className="px-3 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-primary/5 align-middle hover:bg-primary/[0.02]"
              >
                <td className="whitespace-nowrap px-3 py-3 text-sm font-medium text-secondary">
                  {user.fullName}
                </td>
                <td className="px-3 py-3 text-sm text-secondary/80">
                  <span className="block max-w-[220px] truncate" title={user.email}>
                    {user.email}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-sm text-secondary/80">
                  {user.phone !== "—" ? user.phone : "—"}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-sm text-secondary/80">
                  {user.role}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-xs text-secondary/80">
                  {user.createdAt}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-sm text-secondary/80">
                  {user.daysSinceJoined !== null
                    ? `${user.daysSinceJoined}d`
                    : "—"}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-xs text-secondary/80">
                  {user.hasSubscription ? user.planLabel : "—"}
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  {user.hasSubscription ? (
                    <StatusBadge
                      label={user.statusLabel}
                      tone={statusTone(user.subscriptionStatus)}
                    />
                  ) : (
                    <StatusBadge
                      label="Registered"
                      tone="bg-slate-100 text-slate-600"
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
