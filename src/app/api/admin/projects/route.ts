import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Project } from "@/models/Project";
import { getSessionPublicUser } from "@/lib/get-session-user";

export async function POST(req: Request) {
  try {
    const user = await getSessionPublicUser();
    
    if (!user || user.role !== "SuperAdmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, stack, difficulty, icon, details } = body;

    if (!title || !description || !stack || !difficulty || !icon) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();
    const newProject = await Project.create({
      title,
      description,
      stack,
      difficulty,
      icon,
      details: details || "",
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
