import { connectDB } from "@/lib/mongodb";
import { LearningTrack, LearningLevel, LearningQuestion, getTrackingModels } from "@/models/learning";
import { getSessionPublicUser } from "@/lib/get-session-user";
import ProblemsSheetClient from "./components/problems-sheet-client";

export const dynamic = "force-dynamic";

export default async function ProblemsHomePage() {
  await connectDB();

  // 1. Fetch published tracks of kind "track"
  const tracksDoc = await LearningTrack.find({ status: "published", kind: "track" })
    .sort({ order: 1, title: 1 })
    .lean();

  const trackIds = tracksDoc.map((t) => t._id);

  // 2. Fetch published levels belonging to those tracks
  const levelsDoc = await LearningLevel.find({
    trackId: { $in: trackIds },
    status: "published",
  })
    .sort({ levelNumber: 1 })
    .lean();

  const levelIds = levelsDoc.map((l) => l._id);

  // 3. Fetch published questions belonging to those levels
  const questionsDoc = await LearningQuestion.find({
    levelId: { $in: levelIds },
    status: "published",
  })
    .sort({ order: 1 })
    .lean();

  // 4. Fetch session and solved question attempts
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

      const tracking = await getTrackingModels();
      const { UserLearningAttempt } = tracking;

      const correctAttempts = await UserLearningAttempt.find({
        userId: session.id,
        entityType: "question",
        isCorrect: true,
      })
        .select({ entityId: 1 })
        .lean();

      initialSolvedQuestionIds = correctAttempts.map((item) => String(item.entityId));
    }
  } catch (error) {
    console.warn("[ProblemsHomePage] Failed to fetch user progress details:", error);
  }

  // 5. Structure data hierarchically: Track -> Level -> Question
  // Map levelId to level objects
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

  // Distribute questions into their levels
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

  // Assemble tracks with their levels
  const tracks = tracksDoc.map((track) => {
    const trackLevels = levelsDoc
      .filter((level) => String(level.trackId) === String(track._id))
      .map((level) => levelsMap.get(String(level._id)))
      .filter(Boolean);

    // Sort questions within each level
    trackLevels.forEach((level) => {
      level.questions.sort((a: any, b: any) => a.order - b.order);
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
    />
  );
}
