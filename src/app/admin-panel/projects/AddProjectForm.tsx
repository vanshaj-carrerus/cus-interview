"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProjectForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

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
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      setSuccess(true);
      formRef.current?.reset();
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-2xl font-bold text-secondary mb-6">Add New Project</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
          Project successfully added!
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
          <input name="title" required type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none" placeholder="e.g. Full-Stack Todo App" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Short Description</label>
          <input name="description" required type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none" placeholder="e.g. Build a CRUD app with authentication..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tech Stack</label>
            <input name="stack" required type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none" placeholder="e.g. React · Node.js · MongoDB" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Difficulty</label>
            <select name="difficulty" required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none">
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Icon</label>
          <select name="icon" required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none">
            <option value="code">Code (Code2)</option>
            <option value="globe">Globe (Globe)</option>
            <option value="server">Server (Server)</option>
            <option value="folder">Folder (FolderKanban)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Detailed Information (Markdown/HTML supported)</label>
          <textarea name="details" rows={8} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none" placeholder="Enter detailed project requirements, setup instructions, etc." />
        </div>

        <button disabled={loading} type="submit" className="w-full bg-primary text-white font-semibold py-2.5 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
          {loading ? "Adding..." : "Add Project"}
        </button>
      </form>
    </div>
  );
}
