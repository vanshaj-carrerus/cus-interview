"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Code2, Globe, Server, FolderKanban, Trash2, Edit2, X } from "lucide-react";

const projectIcons = {
  code: Code2,
  globe: Globe,
  server: Server,
  folder: FolderKanban,
} as const;

export default function ProjectListAdmin({ projects }: { projects: any[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete project");
      }
    } catch (e) {
      console.error(e);
      alert("Error deleting project");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingProject) return;

    setIsUpdating(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      stack: formData.get("stack"),
      difficulty: formData.get("difficulty"),
      icon: formData.get("icon"),
      details: formData.get("details"),
    };

    try {
      const res = await fetch(`/api/admin/projects/${editingProject._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setEditingProject(null);
        router.refresh();
      } else {
        alert("Failed to update project");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating project");
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-2xl font-bold text-secondary mb-6">Existing Projects</h2>
      
      {projects.length === 0 ? (
        <p className="text-slate-500 text-sm">No projects found. Create one to get started.</p>
      ) : (
        <div className="divide-y divide-slate-100">
          {projects.map((project) => {
            const Icon = projectIcons[project.icon as keyof typeof projectIcons] || Code2;
            
            return (
              <div key={project._id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex shrink-0 h-10 w-10 items-center justify-center rounded-lg bg-[#20b2aa]/10">
                    <Icon className="h-5 w-5 text-[#20b2aa]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">{project.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-slate-500">{project.difficulty}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500">{project.stack}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingProject(project)}
                    className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800 rounded-lg transition-colors"
                    title="Edit Project"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    disabled={deletingId === project._id}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete Project"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setEditingProject(null)}
          />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-lg font-bold text-slate-800">Edit Project</h2>
              <button 
                onClick={() => setEditingProject(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="edit-project-form" onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                  <input name="title" defaultValue={editingProject.title} required type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Short Description</label>
                  <input name="description" defaultValue={editingProject.description} required type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tech Stack</label>
                    <input name="stack" defaultValue={editingProject.stack} required type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Difficulty</label>
                    <select name="difficulty" defaultValue={editingProject.difficulty} required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none">
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Icon</label>
                  <select name="icon" defaultValue={editingProject.icon} required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none">
                    <option value="code">Code (Code2)</option>
                    <option value="globe">Globe (Globe)</option>
                    <option value="server">Server (Server)</option>
                    <option value="folder">Folder (FolderKanban)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Detailed Information</label>
                  <textarea name="details" defaultValue={editingProject.details} rows={6} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none" />
                </div>
              </form>
            </div>
            
            <div className="border-t border-slate-100 p-4 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
              <button 
                type="button"
                onClick={() => setEditingProject(null)}
                className="px-5 py-2 bg-white border border-slate-200 text-sm font-semibold text-slate-700 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="edit-project-form"
                disabled={isUpdating}
                className="px-5 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
