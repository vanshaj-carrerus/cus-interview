"use client";

import { useState } from "react";
import { Code2, FolderKanban, Globe, Server, X } from "lucide-react";

const projectIcons = {
  code: Code2,
  globe: Globe,
  server: Server,
  folder: FolderKanban,
} as const;

type Project = {
  _id: string;
  title: string;
  description: string;
  stack: string;
  difficulty: string;
  icon: keyof typeof projectIcons;
  details?: string;
};

export default function ProjectList({ projects }: { projects: Project[] }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((project) => {
          const Icon = projectIcons[project.icon] || Code2;
          return (
            <button
              key={project._id}
              onClick={() => setSelectedProject(project)}
              className="text-left rounded-xl border border-primary/15 bg-white p-5 hover:border-primary/30 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-secondary">{project.title}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wide text-primary">
                    {project.difficulty}
                  </span>
                </div>
              </div>
              <p className="text-sm text-secondary/60 line-clamp-2">{project.description}</p>
              <p className="mt-2 text-xs font-medium text-secondary/40">{project.stack}</p>
            </button>
          );
        })}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-primary/15">
          <p className="text-secondary/60">No projects found. Check back later!</p>
        </div>
      )}

      {/* Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-secondary/40 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-3">
                {(() => {
                  const Icon = projectIcons[selectedProject.icon] || Code2;
                  return (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                  );
                })()}
                <div>
                  <h2 className="text-lg font-bold text-secondary">{selectedProject.title}</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-primary">
                      {selectedProject.difficulty}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-medium text-secondary/40">{selectedProject.stack}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedProject(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <p className="text-secondary/80 font-medium mb-6">
                {selectedProject.description}
              </p>
              
              <div className="prose prose-sm prose-slate max-w-none">
                {selectedProject.details ? (
                  <div className="whitespace-pre-wrap text-sm text-slate-600">{selectedProject.details}</div>
                ) : (
                  <p className="text-slate-400 italic">No additional details provided for this project.</p>
                )}
              </div>
            </div>
            
            <div className="border-t border-slate-100 p-4 bg-slate-50 rounded-b-2xl flex justify-end">
              <button 
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 bg-white border border-slate-200 text-sm font-semibold text-secondary rounded-lg hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
