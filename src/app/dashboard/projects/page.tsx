import Link from "next/link";
import { ArrowRight, FolderKanban } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import { Project } from "@/models/Project";
import ProjectList from "./ProjectList";
import { getSessionPublicUser } from "@/lib/get-session-user";
import { User } from "@/models/User";

export const dynamic = "force-dynamic";

export default async function DashboardProjectsPage() {
  await connectDB();
  const rawProjects = await Project.find({}).sort({ createdAt: -1 }).lean();
  
  // Serialize Mongoose ObjectIds to strings for the client component
  const projects = rawProjects.map(p => ({
    ...p,
    _id: p._id.toString(),
    createdAt: undefined,
    updatedAt: undefined,
  })) as any[];

  // Fetch user completed projects
  const sessionUser = await getSessionPublicUser();
  let completedProjectIds: string[] = [];
  if (sessionUser) {
    const userDoc = await User.findById(sessionUser.id).select("completedProjects").lean();
    if (userDoc && userDoc.completedProjects) {
      completedProjectIds = userDoc.completedProjects.map((id: any) => id.toString());
    }
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-extrabold text-secondary sm:text-3xl">Projects</h1>
        <p className="mt-2 max-w-2xl text-sm text-secondary/60">
          Build real-world projects to strengthen your resume and stand out in interviews. Use our
          compiler and practice problems to sharpen your skills along the way.
        </p>
      </header>

      <ProjectList projects={projects} initialCompletedIds={completedProjectIds} />

      <section className="rounded-xl border border-primary/15 bg-white p-6">
        <h3 className="font-bold text-secondary">Ready to build?</h3>
        <p className="mt-1 text-sm text-secondary/60">
          Use the online compiler to write and test your project code, then analyze your resume to
          highlight your new skills.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/dashboard/compiler"
            className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
          >
            Open Compiler <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/dashboard/resume-analyzer"
            className="inline-flex items-center gap-1 rounded-full border border-primary/20 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/5"
          >
            Analyze Resume
          </Link>
        </div>
      </section>
    </div>
  );
}
