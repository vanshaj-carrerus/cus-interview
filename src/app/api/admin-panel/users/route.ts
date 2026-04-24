import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getSessionPublicUser } from "@/lib/get-session-user";
import { User } from "@/models/User";

async function assertAuthorized() {
  const user = await getSessionPublicUser();
  return user?.role === "SuperAdmin";
}

export async function GET() {
  try {
    if (!(await assertAuthorized())) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await connectDB();
    const users = await User.find({})
      .select({ email: 1, name: 1, createdAt: 1, updatedAt: 1 })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      users: users.map((user) => ({
        id: String(user._id),
        email: String(user.email ?? ""),
        name: String(user.name ?? ""),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
    });
  } catch (error) {
    console.error("admin-panel/users/get", error);
    return NextResponse.json({ error: "Failed to fetch users." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    if (!(await assertAuthorized())) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = (await request.json()) as {
      id?: string;
      data?: { name?: string; email?: string };
    };
    if (!body.id || !body.data) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    await connectDB();
    const updates: { name?: string; email?: string } = {};
    if (typeof body.data.name === "string") {
      updates.name = body.data.name.trim();
    }
    if (typeof body.data.email === "string") {
      updates.email = body.data.email.trim().toLowerCase();
    }
    const updated = await User.findByIdAndUpdate(body.id, { $set: updates }, { new: true })
      .select({ email: 1, name: 1, createdAt: 1, updatedAt: 1 })
      .lean();

    if (!updated) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: String(updated._id),
        email: String(updated.email ?? ""),
        name: String(updated.name ?? ""),
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      },
    });
  } catch (error) {
    console.error("admin-panel/users/update", error);
    return NextResponse.json({ error: "Failed to update user." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await assertAuthorized())) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = (await request.json()) as { id?: string };
    if (!body.id) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    await connectDB();
    const deleted = await User.findByIdAndDelete(body.id).lean();
    if (!deleted) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("admin-panel/users/delete", error);
    return NextResponse.json({ error: "Failed to delete user." }, { status: 500 });
  }
}
