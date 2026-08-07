import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { getSessionPublicUser } from "@/lib/get-session-user";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const user = await getSessionPublicUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = resolvedParams.id;
    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    await connectDB();
    
    // Find current user's completed projects
    const userDoc = await User.findById(user.id).select("completedProjects");
    if (!userDoc) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const completedProjects = userDoc.completedProjects || [];
    const isCompleted = completedProjects.some((id: any) => id.toString() === projectId);

    if (isCompleted) {
      // Remove from completed
      await User.findByIdAndUpdate(user.id, {
        $pull: { completedProjects: projectId }
      });
      return NextResponse.json({ completed: false });
    } else {
      // Add to completed
      await User.findByIdAndUpdate(user.id, {
        $addToSet: { completedProjects: projectId }
      });
      return NextResponse.json({ completed: true });
    }
  } catch (error) {
    console.error("Error toggling project completion:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
