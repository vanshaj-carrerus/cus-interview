import { NextResponse } from "next/server";
import { getSessionPublicUser } from "@/lib/get-session-user";
import { seedLearningContent } from "@/lib/learning/seed";

export async function POST() {
  try {
    const user = await getSessionPublicUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    const result = await seedLearningContent();
    return NextResponse.json({ seeded: result });
  } catch (error) {
    console.error("learning/admin/seed", error);
    return NextResponse.json({ error: "Failed to seed learning content." }, { status: 500 });
  }
}
