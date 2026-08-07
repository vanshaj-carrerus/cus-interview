"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight, X, Code2, Globe, Server, FolderKanban } from "lucide-react";

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

function getDifficultyColor(difficulty: string) {
  const diff = difficulty?.toLowerCase() || '';
  if (diff.includes('beginner')) return 'text-emerald-500';
  if (diff.includes('intermediate') || diff.includes('med')) return 'text-amber-500';
  if (diff.includes('advanced') || diff.includes('hard')) return 'text-rose-500';
  return 'text-slate-500';
}

function getDifficultyShort(difficulty: string) {
  const diff = difficulty?.toLowerCase() || '';
  if (diff.includes('beginner')) return 'Beginner';
  if (diff.includes('intermediate') || diff.includes('med')) return 'Intermediate';
  if (diff.includes('advanced') || diff.includes('hard')) return 'Advanced';
  return difficulty || 'N/A';
}

export default function ProjectList({ projects, initialCompletedIds = [] }: { projects: Project[], initialCompletedIds?: string[] }) {
  const router = useRouter();
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set(initialCompletedIds));
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
      const matchDifficulty = difficultyFilter === "All" || p.difficulty.toLowerCase().includes(difficultyFilter.toLowerCase());
      return matchSearch && matchDifficulty;
    });
  }, [projects, search, difficultyFilter]);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  
  // Ensure current page is valid when filtering changes
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  const paginatedProjects = filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 3;
    
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button key={1} onClick={() => setCurrentPage(1)} className={`h-8 w-8 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100`}>1</button>
      );
      if (startPage > 2) {
        pages.push(<span key="dots-1" className="px-1 text-slate-400">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`h-8 min-w-[32px] px-2 rounded-lg text-sm font-medium transition-colors ${
            currentPage === i 
              ? "bg-[#1e293b] text-white" 
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="dots-2" className="px-1 text-slate-400">...</span>);
      }
      pages.push(
        <button key={totalPages} onClick={() => setCurrentPage(totalPages)} className={`h-8 min-w-[32px] px-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100`}>{totalPages}</button>
      );
    }

    return pages;
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects by title..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#20b2aa]/20 text-sm transition-all"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <select
          className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#20b2aa]/20 text-sm transition-all outline-none min-w-[150px]"
          value={difficultyFilter}
          onChange={(e) => { setDifficultyFilter(e.target.value); setCurrentPage(1); }}
        >
          <option value="All">All Difficulties</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="w-6"></div>
          <div className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">Title</div>
          <div className="text-[11px] font-bold text-slate-400 tracking-wider uppercase text-right">Difficulty</div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">No projects found matching your criteria.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {paginatedProjects.map((project, index) => {
              const globalIndex = (currentPage - 1) * itemsPerPage + index + 1;
              const isCompleted = completedIds.has(project._id);

              return (
                <Link 
                  href={`/dashboard/projects/${project._id}`}
                  key={project._id}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <div className="w-6 flex justify-center">
                    {isCompleted ? (
                      <div className="rounded-full bg-[#20b2aa] flex items-center justify-center h-[22px] w-[22px] shadow-sm">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : (
                      <div className="rounded-full bg-slate-100 flex items-center justify-center h-[22px] w-[22px] text-[11px] font-medium text-slate-400 group-hover:bg-slate-200 transition-colors">
                        {globalIndex}
                      </div>
                    )}
                  </div>
                  <div className="font-medium text-[#118c7e] text-[15px] group-hover:text-emerald-700 transition-colors">
                    {project.title}
                  </div>
                  <div className={`text-sm font-medium ${getDifficultyColor(project.difficulty)}`}>
                    {getDifficultyShort(project.difficulty)}
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {filteredProjects.length > 0 && (
          <div className="px-6 py-4 flex items-center justify-between bg-white border-t border-slate-100">
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={itemsPerPage}
                  onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  className="appearance-none px-3 py-1.5 pr-8 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#20b2aa]/20 cursor-pointer"
                >
                  <option value={12}>12 / page</option>
                  <option value={24}>24 / page</option>
                  <option value={48}>48 / page</option>
                </select>
                <svg className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                disabled={currentPage === 1} 
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-1">
                {renderPageNumbers()}
              </div>

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                disabled={currentPage === totalPages || totalPages === 0} 
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
