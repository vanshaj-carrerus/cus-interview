import { connectDB } from "@/lib/mongodb";
import { Project } from "@/models/Project";
import AddProjectForm from "./AddProjectForm";
import ProjectListAdmin from "./ProjectListAdmin";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  await connectDB();
  const rawProjects = await Project.find({}).sort({ createdAt: -1 }).lean();
  
  // Serialize ObjectIds for client components
  const projects = rawProjects.map(p => ({
    ...p,
    _id: p._id.toString(),
    createdAt: undefined,
    updatedAt: undefined,
  })) as any[];

  return (
    <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8 items-start">
      <div className="w-full lg:sticky lg:top-8">
        <AddProjectForm />
      </div>
      <div className="w-full">
        <ProjectListAdmin projects={projects} />
      </div>
    </div>
  );
}