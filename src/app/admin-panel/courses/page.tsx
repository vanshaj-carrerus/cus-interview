import Link from "next/link";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { LearningLanguage, LearningLevel, LearningQuestion, LearningTrack } from "@/models/learning";
import { parseTopicDataFromUploadedTsFile } from "../lib/topic-import";

export const dynamic = "force-dynamic";

async function addCourseAction(formData: FormData) {
  "use server";
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const intro = String(formData.get("intro") ?? "").trim();
  if (!title || !slug) return;

  await connectDB();
  const language = await LearningLanguage.findOneAndUpdate(
    { slug },
    { $set: { name: title, description: intro, status: "published" } },
    { upsert: true, new: true }
  );
  await LearningTrack.create({
    languageId: language._id,
    title,
    slug,
    intro,
    kind: "course",
    status: "published",
  });
  revalidatePath("/admin-panel");
}

async function importCourseFileAction(formData: FormData) {
  "use server";
  const uploadedFile = formData.get("questionsFile");
  if (!(uploadedFile instanceof File)) return;

  await connectDB();
  const fileSource = await uploadedFile.text();
  const topic = parseTopicDataFromUploadedTsFile(fileSource);
  const requestedLimitRaw = Number(formData.get("count") ?? 0);
  const requestedLimit =
    Number.isFinite(requestedLimitRaw) && requestedLimitRaw > 0 ? Math.floor(requestedLimitRaw) : Infinity;

  const language = await LearningLanguage.findOneAndUpdate(
    { slug: topic.slug },
    {
      $set: {
        name: topic.title,
        description: topic.intro,
        status: "published",
      },
    },
    { upsert: true, new: true }
  );
  const course = await LearningTrack.findOneAndUpdate(
    { slug: topic.slug },
    {
      $set: {
        languageId: language._id,
        title: topic.title,
        intro: topic.intro,
        kind: "course",
        status: "published",
      },
    },
    { upsert: true, new: true }
  );

  let insertedCount = 0;
  for (const [levelIndex, level] of topic.levels.entries()) {
    if (insertedCount >= requestedLimit) break;

    const levelDoc = await LearningLevel.findOneAndUpdate(
      { trackId: course._id, levelNumber: level.level },
      {
        $set: {
          title: level.title,
          description: level.description,
          passScore: level.passScore,
          order: levelIndex,
          status: "published",
        },
      },
      { upsert: true, new: true }
    );

    const remaining = requestedLimit - insertedCount;
    if (remaining <= 0) break;
    const existing = await LearningQuestion.find({
      levelId: levelDoc._id,
      externalId: { $in: level.questions.map((q) => q.id) },
    })
      .select({ externalId: 1 })
      .lean();
    const existingIds = new Set(existing.map((item) => String(item.externalId)));
    const toInsert = level.questions
      .filter((q) => !existingIds.has(q.id))
      .slice(0, remaining)
      .map((q, index) => ({
        levelId: levelDoc._id,
        externalId: q.id,
        prompt: q.question,
        options: q.options.map((option, optionIndex) => ({ id: String(optionIndex), text: option })),
        correctOptionId: String(q.answerIndex ?? 0),
        explanation: q.explanation,
        difficulty: "medium" as const,
        status: "published" as const,
        order: index,
      }));
    if (toInsert.length) {
      await LearningQuestion.collection.insertMany(toInsert, { ordered: false });
      insertedCount += toInsert.length;
    }
  }
  revalidatePath("/admin-panel");
}

export default async function CoursesPage() {
  await connectDB();
  const courses = await LearningTrack.find({ kind: "course" }).sort({ title: 1 }).lean();
  const levels = await LearningLevel.find({ trackId: { $in: courses.map((item) => item._id) } })
    .select({ trackId: 1, _id: 1 })
    .lean();
  const questions = await LearningQuestion.find({ levelId: { $in: levels.map((item) => item._id) } })
    .select({ levelId: 1 })
    .lean();
  const levelCount = new Map<string, number>();
  const levelToTrack = new Map<string, string>();
  levels.forEach((level) => {
    const key = String(level.trackId);
    levelCount.set(key, (levelCount.get(key) ?? 0) + 1);
    levelToTrack.set(String(level._id), key);
  });
  const questionCount = new Map<string, number>();
  questions.forEach((question) => {
    const trackId = levelToTrack.get(String(question.levelId));
    if (!trackId) return;
    questionCount.set(trackId, (questionCount.get(trackId) ?? 0) + 1);
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-secondary">Courses</h2>
        <p className="mt-1 text-sm text-secondary/70">Manage all course pages and content.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <form action={addCourseAction} className="rounded-xl border border-primary/20 bg-white p-4">
          <p className="mb-3 text-sm font-semibold text-secondary">Add New Course</p>
          <div className="space-y-2">
            <input name="title" required placeholder="Course title" className="w-full rounded-lg border border-primary/20 bg-white px-3 py-2 text-sm text-secondary" />
            <input name="slug" required placeholder="course-slug" className="w-full rounded-lg border border-primary/20 bg-white px-3 py-2 text-sm text-secondary" />
            <textarea name="intro" placeholder="Course intro" className="h-24 w-full rounded-lg border border-primary/20 bg-white px-3 py-2 text-sm text-secondary" />
            <button className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white">Add Course</button>
          </div>
        </form>

        <form action={importCourseFileAction} className="rounded-xl border border-primary/20 bg-white p-4">
          <p className="mb-3 text-sm font-semibold text-secondary">Import Course By File</p>
          <div className="space-y-2">
            <input name="questionsFile" type="file" accept=".ts" required className="w-full rounded-lg border border-primary/20 bg-white px-3 py-2 text-sm text-secondary" />
            <input name="count" type="number" min="1" placeholder="Question limit (optional)" className="w-full rounded-lg border border-primary/20 bg-white px-3 py-2 text-sm text-secondary" />
            <button className="rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-white">Import Course</button>
          </div>
        </form>
      </div>

      <div className="overflow-x-auto rounded-xl border border-primary/20">
        <table className="min-w-full text-sm">
          <thead className="bg-primary/10 text-secondary">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Slug</th>
              <th className="px-4 py-3 text-left">Levels</th>
              <th className="px-4 py-3 text-left">Questions</th>
              <th className="px-4 py-3 text-left">Open</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/10">
            {courses.map((course) => (
              <tr key={String(course._id)}>
                <td className="px-4 py-3">{String(course.title)}</td>
                <td className="px-4 py-3 text-secondary/60">{String(course.slug)}</td>
                <td className="px-4 py-3">{levelCount.get(String(course._id)) ?? 0}</td>
                <td className="px-4 py-3">{questionCount.get(String(course._id)) ?? 0}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin-panel/courses/${String(course.slug)}`} className="text-primary hover:underline">
                    Manage
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
