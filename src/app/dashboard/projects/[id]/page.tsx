import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { Project } from "@/models/Project";
import { getSessionPublicUser } from "@/lib/get-session-user";
import { User } from "@/models/User";
import { ArrowLeft, Code2, Globe, Server, FolderKanban } from "lucide-react";
import Link from "next/link";
import CompleteButton from "./CompleteButton";

const projectIcons = {
  code: Code2,
  globe: Globe,
  server: Server,
  folder: FolderKanban,
} as const;

function getDifficultyColor(difficulty: string) {
  const diff = difficulty?.toLowerCase() || '';
  if (diff.includes('easy')) return 'text-emerald-500';
  if (diff.includes('med')) return 'text-amber-500';
  if (diff.includes('hard')) return 'text-rose-500';
  return 'text-slate-500';
}

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  await connectDB();
  
  let project = null;
  try {
    project = await Project.findById(resolvedParams.id).lean();
  } catch (err) {
    // Catch potential invalid ObjectId errors
    notFound();
  }

  if (!project) {
    notFound();
  }

  const sessionUser = await getSessionPublicUser();
  let isCompleted = false;
  if (sessionUser) {
    const userDoc = await User.findById(sessionUser.id).select("completedProjects").lean();
    if (userDoc && userDoc.completedProjects) {
      isCompleted = userDoc.completedProjects.some((id: any) => id.toString() === resolvedParams.id);
    }
  }

  const Icon = projectIcons[project.icon as keyof typeof projectIcons] || Code2;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link 
        href="/dashboard/projects"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Projects
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row gap-6 items-start justify-between">
          <div className="flex items-start gap-5">
            <div className="flex shrink-0 h-14 w-14 items-center justify-center rounded-xl bg-[#20b2aa]/10">
              <Icon className="h-7 w-7 text-[#20b2aa]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{project.title}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className={`text-xs font-bold uppercase tracking-widest ${getDifficultyColor(project.difficulty)}`}>
                  {project.difficulty}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-sm font-medium text-slate-500">{project.stack}</span>
              </div>
            </div>
          </div>
          
          <div className="shrink-0 w-full md:w-auto">
            <CompleteButton projectId={resolvedParams.id} initialCompleted={isCompleted} />
          </div>
        </div>

        <div className="p-8 space-y-8">
          <section>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Overview</h2>
            <p className="text-slate-700 text-lg leading-relaxed">
              {project.description}
            </p>
          </section>

          {project.details && (
            <section>
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Implementation Details</h2>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap bg-slate-50 rounded-xl p-6 border border-slate-100">
                {project.details}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
