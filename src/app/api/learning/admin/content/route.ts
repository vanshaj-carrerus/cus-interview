import { NextResponse } from "next/server";
import type { Model } from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { getSessionPublicUser } from "@/lib/get-session-user";
import {
  LearningLanguage,
  LearningLevel,
  LearningQuestion,
  LearningTask,
  LearningTrack,
} from "@/models/learning";

type EntityName = "language" | "track" | "level" | "question" | "task";

const modelMap = {
  language: LearningLanguage,
  track: LearningTrack,
  level: LearningLevel,
  question: LearningQuestion,
  task: LearningTask,
} as const;

type CrudModel = Model<Record<string, unknown>>;

async function assertAuthorized() {
  const user = await getSessionPublicUser();
  return user?.role === "SuperAdmin";
}

export async function POST(request: Request) {
  try {
    if (!(await assertAuthorized())) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    const body = (await request.json()) as { entity: EntityName; data: Record<string, unknown> };
    const model = modelMap[body.entity] as unknown as CrudModel | undefined;
    if (!model) {
      return NextResponse.json({ error: "Unsupported entity." }, { status: 400 });
    }
    await connectDB();
    const created = await model.create(body.data);
    if (!created) {
      return NextResponse.json({ error: "Failed to create content." }, { status: 500 });
    }
    return NextResponse.json({ id: String(created._id) }, { status: 201 });
  } catch (error) {
    console.error("learning/admin/create", error);
    return NextResponse.json({ error: "Failed to create content." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    if (!(await assertAuthorized())) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    const body = (await request.json()) as {
      entity: EntityName;
      id: string;
      data: Record<string, unknown>;
    };
    const model = modelMap[body.entity] as unknown as CrudModel | undefined;
    if (!model || !body.id) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }
    await connectDB();
    const updated = await model.findByIdAndUpdate(body.id, { $set: body.data }, { returnDocument: 'after' });
    if (!updated) {
      return NextResponse.json({ error: "Content not found." }, { status: 404 });
    }
    return NextResponse.json({ id: String(updated._id) });
  } catch (error) {
    console.error("learning/admin/update", error);
    return NextResponse.json({ error: "Failed to update content." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await assertAuthorized())) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    const body = (await request.json()) as { entity: EntityName; id: string };
    const model = modelMap[body.entity] as unknown as CrudModel | undefined;
    if (!model || !body.id) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }
    await connectDB();
    const deleted = await model.findByIdAndDelete(body.id);
    if (!deleted) {
      return NextResponse.json({ error: "Content not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("learning/admin/delete", error);
    return NextResponse.json({ error: "Failed to delete content." }, { status: 500 });
  }
}
