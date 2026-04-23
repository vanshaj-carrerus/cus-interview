import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

async function updateUserAction(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  if (!id || !email) return;
  await connectDB();
  await User.findByIdAndUpdate(id, { $set: { name, email } });
  revalidatePath("/admin-panel");
}

async function deleteUserAction(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await connectDB();
  await User.findByIdAndDelete(id);
  revalidatePath("/admin-panel");
}

export default async function UsersPage() {
  await connectDB();
  const users = await User.find({})
    .select({ name: 1, email: 1, createdAt: 1 })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-secondary">Users</h2>
        <p className="mt-1 text-sm text-secondary/70">
          Edit or delete registered users.
        </p>
      </div>

      <div className="space-y-3">
        {users.map((user) => (
          <div
            key={String(user._id)}
            className="rounded-xl border border-primary/20 bg-white p-4"
          >
            <form
              action={updateUserAction}
              className="grid gap-3 lg:grid-cols-[1fr_1fr_auto]"
            >
              <input type="hidden" name="id" value={String(user._id)} />
              <input
                name="name"
                defaultValue={String(user.name ?? "")}
                placeholder="Name"
                className="rounded-lg border border-primary/20 bg-white px-3 py-2 text-sm text-secondary"
              />
              <input
                name="email"
                defaultValue={String(user.email ?? "")}
                required
                placeholder="Email"
                className="rounded-lg border border-primary/20 bg-white px-3 py-2 text-sm text-secondary"
              />
              <button className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white">
                Save
              </button>
            </form>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-secondary/60">
                Joined{" "}
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "-"}
              </p>
              <form action={deleteUserAction}>
                <input type="hidden" name="id" value={String(user._id)} />
                <button className="rounded-lg border border-primary/30 px-3 py-1.5 text-xs text-primary hover:bg-primary/5">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
