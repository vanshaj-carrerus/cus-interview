// "use client"

// import Link from "next/link";
// import { Loader2 } from "lucide-react";
// import { usePathname } from "next/navigation";
// import { useEffect, useMemo, useState } from "react";

// import { logLearningProgress } from "@/lib/learning-progress-debug";

// type TopicProgress = {
//   slug: string;
//   title: string;
//   href: string;
//   totalLevels: number;
//   completedLevels: number;
//   attemptedProblems: number;
//   solvedProblems: number;
//   languageSlug: string;
// };

// type LanguageProgress = {
//   languageSlug: string;
//   languageName: string;
//   attempts: number;
//   cleared: number;
//   completedTracks: number;
//   totalTracks: number;
// };

// type ApiLanguage = {
//   id: string;
//   slug: string;
//   name: string;
// };

// type ApiTrack = {
//   id: string;
//   slug: string;
//   title: string;
//   totalLevels: number;
// };

// type ApiProgressTrack = {
//   trackSlug: string;
//   totalLevels: number;
//   completedLevels: number;
//   attempts: number;
//   cleared: number;
// };

// type ApiProgressLanguage = {
//   languageSlug: string;
//   attempts: number;
//   cleared: number;
//   tracks: ApiProgressTrack[];
// };

// type ApiProgressResponse = {
//   progress?: ApiProgressLanguage[];
//   totals?: {
//     totalAttempts?: number;
//     totalCleared?: number;
//     totalQuestionsAttempted?: number;
//     totalTasksAttempted?: number;
//   };
// };

// type AiMockInterviewHistoryItem = {
//   id: string;
//   status: "created" | "in_progress" | "completed" | "cancelled";
//   role: string;
//   framework: string;
//   seniority: string;
//   createdAt: string;
//   questionsCount: number;
//   answeredCount: number;
//   averageScoreOutOf10: number;
// };

// function normalizeAttemptCount(attempts: number, cleared: number) {
//   return Math.max(0, attempts, cleared);
// }

// function getAccuracyPercent(cleared: number, attempts: number) {
//   if (attempts <= 0) return 0;
//   return Math.min(100, Math.round((cleared / attempts) * 100));
// }

// export default function Sidebar() {
//   const pathname = usePathname();
//   /** All published tracks across languages (for snapshot totals). */
//   const [allTrackRows, setAllTrackRows] = useState<TopicProgress[]>([]);
//   const [progressRows, setProgressRows] = useState<TopicProgress[]>([]);
//   const [languageRows, setLanguageRows] = useState<LanguageProgress[]>([]);
//   /** Micro submissions vs correct answers (same units as profile totals). */
//   const [answerTotals, setAnswerTotals] = useState<{ submissions: number; correct: number }>({
//     submissions: 0,
//     correct: 0,
//   });
//   const [mockInterviews, setMockInterviews] = useState<AiMockInterviewHistoryItem[]>([]);
//   const [loadedOnce, setLoadedOnce] = useState(false);
//   const [fetching, setFetching] = useState(true);

//   useEffect(() => {
//     const loadProgress = async () => {
//       setFetching(true);
//       try {
//         const languagesRes = await fetch("/api/learning/languages", { cache: "no-store" });
//         if (!languagesRes.ok) return;
//         const languagesPayload = (await languagesRes.json()) as { languages?: ApiLanguage[] };
//         const languages = languagesPayload.languages ?? [];

//         const tracksPayload = await Promise.all(
//           languages.map(async (language) => {
//             const tracksRes = await fetch(
//               `/api/learning/languages/${language.slug}/tracks?kind=track`,
//               { cache: "no-store" },
//             );
//             if (!tracksRes.ok) {
//               return { language, tracks: [] as ApiTrack[] };
//             }
//             const data = (await tracksRes.json()) as { tracks?: ApiTrack[] };
//             return { language, tracks: data.tracks ?? [] };
//           }),
//         );

//         const progressRes = await fetch("/api/learning/me/progress", {
//           cache: "no-store",
//           credentials: "include",
//         });
//         logLearningProgress("sidebar", "/api/learning/me/progress", {
//           status: progressRes.status,
//           ok: progressRes.ok,
//         });
//         const progressPayload: ApiProgressResponse = progressRes.ok
//           ? ((await progressRes.json()) as ApiProgressResponse)
//           : {};
//         const mockInterviewsRes = await fetch("/api/mock-interviews/ai-mock/history", {
//           cache: "no-store",
//         });
//         const mockInterviewsPayload = mockInterviewsRes.ok
//           ? ((await mockInterviewsRes.json()) as { interviews?: AiMockInterviewHistoryItem[] })
//           : {};

//         const progressByTrackSlug = new Map<string, ApiProgressTrack>();
//         const progressByLanguageSlug = new Map<string, ApiProgressLanguage>();
//         (progressPayload.progress ?? []).forEach((languageProgress) => {
//           progressByLanguageSlug.set(languageProgress.languageSlug, languageProgress);
//           languageProgress.tracks.forEach((track) => {
//             progressByTrackSlug.set(track.trackSlug, track);
//           });
//         });

//         const t = progressPayload.totals;
//         const submissions =
//           (Number(t?.totalQuestionsAttempted) || 0) + (Number(t?.totalTasksAttempted) || 0);
//         setAnswerTotals({
//           submissions,
//           correct: Number(t?.totalCleared) || 0,
//         });

//         const rows: TopicProgress[] = tracksPayload
//           .flatMap(({ language, tracks }) =>
//             tracks.map((track) => {
//               const progress = progressByTrackSlug.get(track.slug);
//               return {
//                 slug: track.slug,
//                 title: track.title,
//                 href: `/problems/${track.slug}`,
//                 totalLevels: track.totalLevels,
//                 completedLevels: progress?.completedLevels ?? 0,
//                 attemptedProblems: progress?.attempts ?? 0,
//                 solvedProblems: progress?.cleared ?? 0,
//                 languageSlug: language.slug,
//               };
//             }),
//           )
//           .sort((a, b) => a.title.localeCompare(b.title));

//         const nextLanguageRows: LanguageProgress[] = tracksPayload
//           .map(({ language, tracks }) => {
//             const progress = progressByLanguageSlug.get(language.slug);
//             const completedTracks = tracks.filter((track) => {
//               const trackProgress = progress?.tracks.find((item) => item.trackSlug === track.slug);
//               const completedLevels = trackProgress?.completedLevels ?? 0;
//               return track.totalLevels > 0 && completedLevels >= track.totalLevels;
//             }).length;
//             return {
//               languageSlug: language.slug,
//               languageName: language.name,
//               attempts: progress?.attempts ?? 0,
//               cleared: progress?.cleared ?? 0,
//               completedTracks,
//               totalTracks: tracks.length,
//             };
//           })
//           .filter((language) => language.attempts > 0);

//         setAllTrackRows(rows);
//         setProgressRows(rows.filter((row) => row.attemptedProblems > 0));
//         setLanguageRows(nextLanguageRows);
//         setMockInterviews(mockInterviewsPayload.interviews ?? []);
//       } catch {
//         setAllTrackRows([]);
//         setProgressRows([]);
//         setLanguageRows([]);
//         setAnswerTotals({ submissions: 0, correct: 0 });
//         setMockInterviews([]);
//       } finally {
//         setFetching(false);
//         setLoadedOnce(true);
//       }
//     };

//     loadProgress();
//     window.addEventListener("storage", loadProgress);
//     window.addEventListener("practice-progress-updated", loadProgress);
//     return () => {
//       window.removeEventListener("storage", loadProgress);
//       window.removeEventListener("practice-progress-updated", loadProgress);
//     };
//   }, []);

//   const summary = useMemo(() => {
//     const completedLevels = allTrackRows.reduce((sum, item) => sum + item.completedLevels, 0);
//     const totalLevels = allTrackRows.reduce((sum, item) => sum + item.totalLevels, 0);
//     const completionPercent = totalLevels > 0 ? Math.round((completedLevels / totalLevels) * 100) : 0;
//     const totalTracks = allTrackRows.length;
//     const startedTracks = allTrackRows.filter(
//       (item) => item.attemptedProblems > 0 || item.completedLevels > 0
//     ).length;
//     const fullyCompletedTracks = allTrackRows.filter(
//       (item) => item.totalLevels > 0 && item.completedLevels >= item.totalLevels
//     ).length;
//     const attemptedProblems = answerTotals.submissions;
//     const solvedProblems = answerTotals.correct;
//     const solvedRatePercent =
//       attemptedProblems > 0
//         ? Math.min(100, Math.round((solvedProblems / attemptedProblems) * 100))
//         : 0;

//     const catalogLanguages = new Set(allTrackRows.map((r) => r.languageSlug)).size;
//     const languagesWithProgress = new Set(
//       allTrackRows
//         .filter((r) => r.attemptedProblems > 0 || r.completedLevels > 0)
//         .map((r) => r.languageSlug)
//     ).size;

//     return {
//       completedLevels,
//       totalLevels,
//       completionPercent,
//       totalTracks,
//       startedTracks,
//       fullyCompletedTracks,
//       attemptedProblems,
//       solvedProblems,
//       solvedRatePercent,
//       catalogLanguages,
//       languagesWithProgress,
//     };
//   }, [allTrackRows, answerTotals]);

//   const activeTrack = useMemo(
//     () => progressRows.find((item) => pathname?.startsWith(item.href)) ?? null,
//     [pathname, progressRows],
//   );

//   const nextTrack = useMemo(
//     () => progressRows.find((item) => item.completedLevels < item.totalLevels) ?? null,
//     [progressRows],
//   );

//   if (!loadedOnce) {
//     return (
//       <aside
//         className="w-full lg:w-80 bg-slate-100 p-4 flex flex-col gap-4 font-sans"
//         aria-busy="true"
//         aria-label="Loading practice progress"
//       >
//         <div className="rounded-3xl border border-slate-200 overflow-hidden shadow-sm bg-white">
//           <div className="h-28 bg-linear-to-r from-indigo-700 to-blue-600 animate-pulse" />
//           <div className="p-4 space-y-4">
//             <div className="mx-auto h-20 w-20 rounded-full bg-primary/15 animate-pulse" />
//             <div className="space-y-2">
//               {Array.from({ length: 6 }).map((_, i) => (
//                 <div key={i} className="h-4 rounded bg-secondary/10 animate-pulse" />
//               ))}
//             </div>
//           </div>
//         </div>
//         {Array.from({ length: 4 }).map((_, i) => (
//           <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
//             <div className="h-3 w-1/3 rounded bg-primary/15 animate-pulse" />
//             <div className="h-10 rounded-lg bg-secondary/10 animate-pulse" />
//             <div className="h-10 rounded-lg bg-secondary/10 animate-pulse" />
//           </div>
//         ))}
//         <p className="sr-only">Loading practice sidebar…</p>
//       </aside>
//     );
//   }

//   return (
//     <aside
//       className="relative w-full lg:w-80 bg-slate-100 p-4 flex flex-col gap-4 font-sans"
//       aria-busy={fetching}
//     >
//       {fetching ? (
//         <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 rounded-lg bg-white/70 backdrop-blur-[1px]">
//           <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
//           <span className="sr-only">Updating practice progress</span>
//         </div>
//       ) : null}
//       <div className="rounded-3xl border border-slate-200 overflow-hidden shadow-sm bg-white">
//         <div className="bg-linear-to-r from-indigo-700 to-blue-600 p-5 text-white">
//           <p className="text-xs uppercase tracking-[0.2em] text-white/75">Profile Snapshot</p>
//           <p className="text-xl font-bold mt-2">Practice Snapshot</p>
//           <p className="text-sm text-white/85 mt-1">
//             Live progress across every language and track in the catalog.
//           </p>
//         </div>
//         <div className="p-4">
//           <div className="flex flex-col items-center gap-4">
//             <div className="relative w-20 h-20 shrink-0">
//               <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
//                 <circle
//                   cx="18"
//                   cy="18"
//                   r="15.9"
//                   fill="none"
//                   stroke="#e2e8f0"
//                   strokeWidth="3.5"
//                 />
//                 <circle
//                   cx="18"
//                   cy="18"
//                   r="15.9"
//                   fill="none"
//                   stroke="#14b8a6"
//                   strokeWidth="3.5"
//                   strokeDasharray={`${summary.completionPercent} ${100 - summary.completionPercent}`}
//                   strokeLinecap="round"
//                 />
//               </svg>
//               <span className="absolute inset-0 grid place-items-center text-xs font-semibold text-slate-600">
//                 {summary.completionPercent}%
//               </span>
//             </div>
//             <div className="flex-1 grid gap-2 text-sm">
//               <div className="flex items-center justify-between gap-2">
//                 <span className="text-slate-500">Levels cleared (all languages)</span>
//                 <span className="font-semibold text-slate-800">
//                   {summary.completedLevels} / {summary.totalLevels}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between gap-2">
//                 <span className="text-slate-500">Correct answers (all tracks)</span>
//                 <span className="font-semibold text-slate-800">
//                   {summary.solvedProblems} / {summary.attemptedProblems}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between gap-2">
//                 <span className="text-slate-500">Success rate</span>
//                 <span className="font-semibold text-slate-800">{summary.solvedRatePercent}%</span>
//               </div>
//               <div className="flex items-center justify-between gap-2">
//                 <span className="text-slate-500">Languages with progress</span>
//                 <span className="font-semibold text-slate-800">
//                   {summary.languagesWithProgress} / {summary.catalogLanguages}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between gap-2">
//                 <span className="text-slate-500">Tracks with progress</span>
//                 <span className="font-semibold text-slate-800">
//                   {summary.startedTracks} / {summary.totalTracks}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between gap-2">
//                 <span className="text-slate-500">Tracks fully cleared</span>
//                 <span className="font-semibold text-emerald-600">
//                   {summary.fullyCompletedTracks} / {summary.totalTracks}
//                 </span>
//               </div>
//             </div>
//           </div>
//           {activeTrack ? (
//             <p className="mt-4 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-600">
//               Current: <span className="font-semibold text-slate-800">{activeTrack.title}</span> (
//               {activeTrack.solvedProblems}/{activeTrack.attemptedProblems} solved,{" "}
//               {activeTrack.completedLevels}/{activeTrack.totalLevels} levels)
//             </p>
//           ) : null}
//         </div>
//       </div>

//       <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
//         <div className="flex items-center justify-between mb-3">
//           <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">
//             Language Progress
//           </p>
//           <p className="text-xs text-slate-500">{languageRows.length} total</p>
//         </div>
//         <div className="flex flex-col gap-2">
//           {languageRows.length === 0 ? (
//             <p className="text-sm text-slate-500">No attempted languages yet.</p>
//           ) : (
//             languageRows.map((language) => {
//             const normalizedAttempts = normalizeAttemptCount(language.attempts, language.cleared);
//             const percent = getAccuracyPercent(language.cleared, normalizedAttempts);
//             return (
//               <div key={language.languageSlug} className="rounded-xl border border-slate-200 px-3 py-2">
//                 <div className="flex items-center justify-between gap-3">
//                   <p className="text-sm font-semibold text-slate-800 truncate">{language.languageName}</p>
//                   <p className="text-xs text-slate-500 shrink-0">
//                     {language.cleared}/{normalizedAttempts} solved
//                   </p>
//                 </div>
//                 <p className="mt-1 text-[11px] text-slate-500">
//                   Tracks: {language.completedTracks}/{language.totalTracks} | Accuracy: {percent}%
//                 </p>
//               </div>
//             );
//             })
//           )}
//         </div>
//       </div>

//       <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
//         <div className="flex items-center justify-between mb-3">
//           <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">
//             Your Tracks
//           </p>
//           <p className="text-xs text-slate-500">{progressRows.length} total</p>
//         </div>

//         <div className="flex flex-col gap-2">
//           {progressRows.length === 0 ? (
//             <p className="text-sm text-slate-500">No attempted tracks yet.</p>
//           ) : (
//             progressRows.map((row) => {
//             const isActive = pathname?.startsWith(row.href);
//             const percent =
//               row.totalLevels > 0 ? Math.round((row.completedLevels / row.totalLevels) * 100) : 0;
//             const normalizedAttempts = normalizeAttemptCount(
//               row.attemptedProblems,
//               row.solvedProblems,
//             );
//             const solvedPercent = getAccuracyPercent(row.solvedProblems, normalizedAttempts);
//             return (
//               <Link
//                 key={row.slug}
//                 href={row.href}
//                 className={`rounded-xl border px-3 py-2 transition-colors ${
//                   isActive ? "border-primary bg-primary/5" : "border-slate-200 hover:bg-slate-50"
//                 }`}
//               >
//                 <div className="flex items-center justify-between gap-3">
//                   <p className="text-sm font-semibold text-slate-800 truncate">{row.title}</p>
//                   <p className="text-xs text-slate-500 shrink-0">
//                     {row.solvedProblems}/{normalizedAttempts} solved
//                   </p>
//                 </div>
//                 <p className="mt-1 text-[11px] text-slate-500">
//                   Level progress: {row.completedLevels}/{row.totalLevels} | Accuracy: {solvedPercent}%
//                 </p>
//                 <div className="mt-2 h-1.5 rounded-full bg-slate-200 overflow-hidden">
//                   <div className="h-full bg-primary rounded-full" style={{ width: `${percent}%` }} />
//                 </div>
//               </Link>
//             );
//             })
//           )}
//         </div>
//       </div>

//       <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
//         <div className="flex items-center justify-between mb-3">
//           <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">
//             AI Mock Interviews
//           </p>
//           <p className="text-xs text-slate-500">{mockInterviews.length} total</p>
//         </div>
//         <Link
//           href="/mock-interviews/ai-mock"
//           className="mb-3 inline-flex w-full items-center justify-center rounded-xl bg-secondary px-3 py-2 text-xs font-black uppercase tracking-widest text-white"
//         >
//           Start new AI mock
//         </Link>
//         <div className="flex flex-col gap-2">
//           {mockInterviews.length === 0 ? (
//             <p className="text-sm text-slate-500">No AI mock interviews yet.</p>
//           ) : (
//             mockInterviews.map((item) => (
//               <Link
//                 key={item.id}
//                 href={`/mock-interviews/ai-mock/${item.id}`}
//                 className={`rounded-xl border px-3 py-2 transition-colors ${
//                   pathname?.includes(`/mock-interviews/ai-mock/${item.id}`)
//                     ? "border-primary bg-primary/5"
//                     : "border-slate-200 hover:bg-slate-50"
//                 }`}
//               >
//                 <div className="flex items-center justify-between gap-3">
//                   <p className="text-sm font-semibold text-slate-800 truncate">
//                     {item.role || item.framework || "General mock"}
//                   </p>
//                   <p className="text-xs text-slate-500 shrink-0">{item.status.replaceAll("_", " ")}</p>
//                 </div>
//                 <p className="mt-1 text-[11px] text-slate-500">
//                   {item.answeredCount}/{item.questionsCount} answered | Avg: {item.averageScoreOutOf10}/10
//                 </p>
//               </Link>
//             ))
//           )}
//         </div>
//       </div>

//       <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
//         <div className="bg-slate-900 p-4">
//           <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-2">
//             Next Best Step
//           </p>
//           <p className="text-sm text-slate-200 leading-relaxed">
//             {nextTrack
//               ? `Continue ${nextTrack.title}. You have solved ${nextTrack.solvedProblems} of ${nextTrack.attemptedProblems} attempted problems and cleared ${nextTrack.completedLevels} of ${nextTrack.totalLevels} levels.`
//               : "Excellent work. You have completed all currently available practice tracks."}
//           </p>
//         </div>

//         <div className="p-4">
//           <p className="font-bold text-slate-800 text-sm">Recommended Action</p>
//           <p className="text-xs text-slate-500 mt-1 leading-relaxed">
//             {nextTrack
//               ? "Jump into your next uncompleted track and finish one level now to keep momentum."
//               : "Revisit solved levels and explain each answer out loud to sharpen interview clarity."}
//           </p>
//           {nextTrack ? (
//             <Link href={nextTrack.href} className="mt-3 inline-flex items-center gap-1 text-primary text-sm font-semibold hover:underline">
//               Continue {nextTrack.title}
//             </Link>
//           ) : (
//             <Link href="/practice" className="mt-3 inline-flex items-center gap-1 text-primary text-sm font-semibold hover:underline">
//               Explore Practice Hub
//             </Link>
//           )}
//         </div>
//       </div>
//     </aside>
//   );
// }
