import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import vm from "node:vm";
import ts from "typescript";
import { connectDB } from "@/lib/mongodb";
import { LearningLanguage, LearningLevel, LearningQuestion, LearningTrack } from "@/models/learning";
import type { TopicData } from "@/app/practice/data/types";

async function addLanguageAction(formData: FormData) {
  "use server";
  await connectDB();
  await LearningLanguage.create({
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    description: String(formData.get("description") ?? ""),
    status: "published",
  });
  revalidatePath("/learning-admin");
  redirect("/learning-admin");
}

async function addTrackAction(formData: FormData) {
  "use server";
  await connectDB();
  await LearningTrack.create({
    languageId: String(formData.get("languageId") ?? ""),
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    intro: String(formData.get("intro") ?? ""),
    kind: String(formData.get("kind") ?? "track"),
    status: "published",
  });
  revalidatePath("/learning-admin");
  redirect("/learning-admin");
}

async function addLevelAction(formData: FormData) {
  "use server";
  await connectDB();
  await LearningLevel.create({
    trackId: String(formData.get("trackId") ?? ""),
    levelNumber: Number(formData.get("levelNumber") ?? 1),
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    passScore: Number(formData.get("passScore") ?? 1),
    status: "published",
  });
  revalidatePath("/learning-admin");
  redirect("/learning-admin");
}

async function addQuestionAction(formData: FormData) {
  "use server";
  await connectDB();
  const optionsCsv = String(formData.get("options") ?? "");
  const options = optionsCsv
    .split(",")
    .map((part, index) => ({ id: String(index), text: part.trim() }))
    .filter((item) => item.text);
  const submittedCorrectId = String(formData.get("correctOptionId") ?? "0").trim();
  const asNumber = Number(submittedCorrectId);
  const normalizedCorrectOptionId =
    Number.isFinite(asNumber) &&
    asNumber >= 0 &&
    asNumber < options.length
      ? String(asNumber)
      : options[0]?.id ?? "0";
  await LearningQuestion.create({
    levelId: String(formData.get("levelId") ?? ""),
    externalId: String(formData.get("externalId") ?? ""),
    prompt: String(formData.get("prompt") ?? ""),
    options,
    correctOptionId: normalizedCorrectOptionId,
    explanation: String(formData.get("explanation") ?? ""),
    status: "published",
  });
  revalidatePath("/learning-admin");
  redirect("/learning-admin");
}

function parseTopicDataFromUploadedTsFile(source: string): TopicData {
  const sourceWithoutImports = source.replace(/^\s*import[\s\S]*?;?\s*$/gm, "");
  const transpiled = ts.transpileModule(sourceWithoutImports, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;

  const moduleExports: Record<string, unknown> = {};
  const sandbox: { module: { exports: Record<string, unknown> }; exports: Record<string, unknown> } = {
    module: { exports: moduleExports },
    exports: moduleExports,
  };
  vm.runInNewContext(transpiled, sandbox, { timeout: 1000 });

  const exportedValues = [
    ...Object.values(sandbox.module.exports ?? {}),
    ...Object.values(sandbox.exports ?? {}),
  ];
  const candidate = exportedValues.find((value) => {
    if (!value || typeof value !== "object") return false;
    const maybeTopic = value as Partial<TopicData>;
    return typeof maybeTopic.slug === "string" && typeof maybeTopic.title === "string" && Array.isArray(maybeTopic.levels);
  });

  if (!candidate) {
    throw new Error("Uploaded file must export a TopicData object.");
  }

  return candidate as TopicData;
}

async function importDsaQuestionsFromFileAction(formData: FormData) {
  "use server";

  await connectDB();

  const uploadedFile = formData.get("questionsFile");
  if (!(uploadedFile instanceof File)) {
    throw new Error("Please upload a TypeScript questions file.");
  }
  const fileSource = await uploadedFile.text();
  const topic = parseTopicDataFromUploadedTsFile(fileSource);
  const requestedLimitRaw = Number(formData.get("count") ?? 0);
  const requestedLimit = Number.isFinite(requestedLimitRaw) && requestedLimitRaw > 0 ? Math.floor(requestedLimitRaw) : Infinity;

  const language = await LearningLanguage.findOneAndUpdate(
    { slug: topic.slug },
    {
      $set: {
        name: topic.title,
        description: topic.intro,
        status: "published",
        order: 0,
      },
    },
    { upsert: true, new: true }
  );

  const track = await LearningTrack.findOneAndUpdate(
    { slug: topic.slug },
    {
      $set: {
        languageId: language._id,
        title: topic.title,
        intro: topic.intro,
        kind: "track",
        status: "published",
        order: 0,
      },
    },
    { upsert: true, new: true }
  );

  let insertedCount = 0;
  for (const [levelIndex, level] of topic.levels.entries()) {
    if (insertedCount >= requestedLimit) break;

    const levelDoc = await LearningLevel.findOneAndUpdate(
      { trackId: track._id, levelNumber: level.level },
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

    const externalIds = level.questions.map((question) => question.id);
    const existingQuestions = await LearningQuestion.find({
      levelId: levelDoc._id,
      externalId: { $in: externalIds },
    })
      .select({ externalId: 1 })
      .lean();
    const existingIds = new Set(existingQuestions.map((item) => String(item.externalId)));

    const questionsToInsert = level.questions
      .filter((question) => !existingIds.has(question.id))
      .slice(0, remaining)
      .map((question, questionIndex) => ({
        levelId: levelDoc._id,
        externalId: question.id,
        prompt: question.question,
        options: question.options.map((option, optionIndex) => ({ id: String(optionIndex), text: option })),
        correctOptionId: String(question.answerIndex ?? 0),
        explanation: question.explanation,
        tags: [],
        difficulty: "medium" as const,
        order: questionIndex,
        status: "published" as const,
      }));

    if (questionsToInsert.length > 0) {
      await LearningQuestion.collection.insertMany(questionsToInsert, { ordered: false });
      insertedCount += questionsToInsert.length;
    }
  }

  revalidatePath("/learning-admin");
  redirect("/learning-admin");
}

export default async function LearningAdminPage() {
  await connectDB();
  const [languages, tracks, levels, questions] = await Promise.all([
    LearningLanguage.find({ status: "published" }).sort({ createdAt: -1 }).lean(),
    LearningTrack.find({ status: "published" }).sort({ createdAt: -1 }).lean(),
    LearningLevel.find({ status: "published" }).sort({ createdAt: -1 }).lean(),
    LearningQuestion.find({ status: "published" }).sort({ createdAt: -1 }).limit(30).lean(),
  ]);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Learning Admin (Test Add + List)</h1>
          <Link href="/practice" className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white">
            Back to Practice
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <form action={importDsaQuestionsFromFileAction} className="rounded-xl bg-white p-4 shadow-sm">
            <h2 className="mb-3 font-semibold text-black">Import DSA Questions From File</h2>
            <p className="mb-3 rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-700">
              Upload a `.ts` file that exports a `TopicData` object (same structure as current DSA file). It inserts only new
              questions and skips duplicate external IDs.
            </p>
            <input className="mb-2 w-full rounded border p-2 text-gray-700" name="questionsFile" type="file" accept=".ts" required />
            <input
              className="mb-2 w-full rounded border p-2 text-gray-700"
              name="count"
              type="number"
              min="1"
              placeholder="How many questions to import (e.g. 10, 20, 50). Leave empty for all."
            />
            <button className="rounded bg-primary px-3 py-2 text-sm text-white">Import Questions</button>
          </form>

          <form action={addLanguageAction} className="rounded-xl bg-white p-4 shadow-sm">
            <h2 className="mb-3 font-semibold text-black">Add Language</h2>
            <input className="mb-2 w-full rounded border p-2 text-gray-700" name="name" placeholder="Name" required />
            <input className="mb-2 w-full rounded border p-2 text-gray-700" name="slug" placeholder="Slug" required />
            <textarea className="mb-2 w-full rounded border p-2 text-gray-700" name="description" placeholder="Description" />
            <button className="rounded bg-primary px-3 py-2 text-sm text-white">Add Language</button>
          </form>

          <form action={addTrackAction} className="rounded-xl bg-white p-4 shadow-sm">
            <h2 className="mb-3 font-semibold text-black">Add Track/Course</h2>
            <select className="mb-2 w-full rounded border p-2 text-gray-800" name="languageId" required>
              {languages.map((language) => (
                <option key={String(language._id)} value={String(language._id)}>
                  {String(language.name)}
                </option>
              ))}
            </select>
            <input className="mb-2 w-full rounded border p-2 text-gray-800" name="title" placeholder="Title" required />
            <input className="mb-2 w-full rounded border p-2 text-gray-800" name="slug" placeholder="Slug" required />
            <select className="mb-2 w-full rounded border p-2 text-gray-800" name="kind">
              <option value="track">Track</option>
              <option value="course">Course</option>
            </select>
            <textarea className="mb-2 w-full rounded border p-2 text-gray-800" name="intro" placeholder="Intro" />
            <button className="rounded bg-primary px-3 py-2 text-sm text-white">Add Track</button>
          </form>

          <form action={addLevelAction} className="rounded-xl bg-white p-4 shadow-sm">
            <h2 className="mb-3 font-semibold text-black">Add Level</h2>
            <select className="mb-2 w-full rounded border p-2 text-gray-800" name="trackId" required>
              {tracks.map((track) => (
                <option key={String(track._id)} value={String(track._id)}>
                  {String(track.title)}
                </option>
              ))}
            </select>
            <input className="mb-2 w-full rounded border p-2 text-gray-800" name="levelNumber" placeholder="Level Number" defaultValue="1" required />
            <input className="mb-2 w-full rounded border p-2 text-gray-800" name="title" placeholder="Title" required />
            <textarea className="mb-2 w-full rounded border p-2 text-gray-800" name="description" placeholder="Description" />
            <input className="mb-2 w-full rounded border p-2 text-gray-800" name="passScore" placeholder="Pass Score" defaultValue="1" required />
            <button className="rounded bg-primary px-3 py-2 text-sm text-white">Add Level</button>
          </form>

          <form action={addQuestionAction} className="rounded-xl bg-white p-4 shadow-sm">
            <h2 className="mb-3 font-semibold text-black">Add Question</h2>
            <p className="mb-3 rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-700">
              Add options as comma-separated values. `correctOptionId` is zero-based:
              first option = `0`, second = `1`, third = `2`.
            </p>
            <select className="mb-2 w-full rounded border p-2 text-gray-800" name="levelId" required>
              {levels.map((level) => (
                <option key={String(level._id)} value={String(level._id)}>
                  Level {Number(level.levelNumber)}: {String(level.title)}
                </option>
              ))}
            </select>
            <input className="mb-2 w-full rounded border p-2 text-gray-800" name="externalId" placeholder="External ID" required />
            <textarea className="mb-2 w-full rounded border p-2 text-gray-800" name="prompt" placeholder="Prompt" required />
            <input className="mb-2 w-full rounded border p-2 text-gray-800" name="options" placeholder="Options comma-separated" defaultValue="Option A,Option B,Option C,Option D" required />
            <input className="mb-2 w-full rounded border p-2 text-gray-800" name="correctOptionId" placeholder="Correct Option Id (0,1,2...)" defaultValue="0" required />
            <textarea className="mb-2 w-full rounded border p-2 text-gray-800" name="explanation" placeholder="Explanation" />
            <button className="rounded bg-primary px-3 py-2 text-sm text-white">Add Question</button>
          </form>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm">
          <h2 className="mb-2 font-semibold">Current Dynamic Data</h2>
          <p className="text-sm text-slate-500">
            Languages: {languages.length} | Tracks/Courses: {tracks.length} | Levels: {levels.length} | Recent Questions: {questions.length}
          </p>
        </div>
      </div>
    </div>
  );
}
