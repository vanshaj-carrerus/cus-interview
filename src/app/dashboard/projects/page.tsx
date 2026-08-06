import Link from "next/link";
import { ArrowRight, FolderKanban } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import { Project } from "@/models/Project";
import ProjectList from "./ProjectList";

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

  return (
    <div className="space-y-8">
      <header>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
          <FolderKanban className="h-3.5 w-3.5 text-primary" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
            Portfolio
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-secondary sm:text-3xl">Projects</h1>
        <p className="mt-2 max-w-2xl text-sm text-secondary/60">
          Build real-world projects to strengthen your resume and stand out in interviews. Use our
          compiler and practice problems to sharpen your skills along the way.
        </p>
      </header>

      <ProjectList projects={projects} />

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
