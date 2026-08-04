import { connectDB } from "@/lib/mongodb";
import { LearningTrack, LearningLevel, LearningQuestion } from "@/models/learning";
import { getSessionPublicUser } from "@/lib/get-session-user";
import { getUserSolvedQuestionIds } from "@/lib/learning/service";
import ProblemsSheetClient from "@/app/problems/components/problems-sheet-client";

export const dynamic = "force-dynamic";

export default async function DashboardPracticeProblemsPage() {
  await connectDB();

  const tracksDoc = await LearningTrack.find({ status: "published", kind: "track" })
    .sort({ order: 1, title: 1 })
    .lean();

  const trackIds = tracksDoc.map((t) => t._id);

  const levelsDoc = await LearningLevel.find({
    trackId: { $in: trackIds },
    status: "published",
  })
    .sort({ levelNumber: 1 })
    .lean();

  const levelIds = levelsDoc.map((l) => l._id);

  const questionsDoc = await LearningQuestion.find({
    levelId: { $in: levelIds },
    status: "published",
  })
    .sort({ order: 1 })
    .lean();

  let initialSolvedQuestionIds: string[] = [];
  let userSession = null;

  try {
    const session = await getSessionPublicUser();
    if (session) {
      userSession = {
        id: session.id,
        email: session.email,
        name: session.name || undefined,
      };

      initialSolvedQuestionIds = await getUserSolvedQuestionIds(session.id);
    }
  } catch (error) {
    console.warn("[DashboardPracticeProblems] Failed to fetch user progress:", error);
  }

  const levelsMap = new Map();
  levelsDoc.forEach((level) => {
    levelsMap.set(String(level._id), {
      id: String(level._id),
      levelNumber: Number(level.levelNumber),
      title: String(level.title),
      description: String(level.description ?? ""),
      questions: [],
    });
  });

  questionsDoc.forEach((q) => {
    const levelObj = levelsMap.get(String(q.levelId));
    if (levelObj) {
      levelObj.questions.push({
        id: String(q._id),
        externalId: String(q.externalId),
        prompt: String(q.prompt),
        difficulty: (q.difficulty ?? "medium") as "easy" | "medium" | "hard",
        order: Number(q.order ?? 0),
      });
    }
  });

  const tracks = tracksDoc.map((track) => {
    const trackLevels = levelsDoc
      .filter((level) => String(level.trackId) === String(track._id))
      .map((level) => levelsMap.get(String(level._id)))
      .filter(Boolean);

    trackLevels.forEach((level) => {
      level.questions.sort((a: { order: number }, b: { order: number }) => a.order - b.order);
    });

    return {
      id: String(track._id),
      slug: String(track.slug),
      title: String(track.title),
      intro: String(track.intro ?? ""),
      iconImage: track.iconImage ? String(track.iconImage) : undefined,
      levels: trackLevels,
    };
  });

  return (
    <ProblemsSheetClient
      tracks={tracks}
      initialSolvedQuestionIds={initialSolvedQuestionIds}
      userSession={userSession}
      compilerBasePath="/dashboard/compiler"
    />
  );
}
