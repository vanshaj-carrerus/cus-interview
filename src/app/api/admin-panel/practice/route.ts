import vm from "node:vm";
import ts from "typescript";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getSessionPublicUser } from "@/lib/get-session-user";
import { LearningLanguage, LearningLevel, LearningQuestion, LearningTrack } from "@/models/learning";
import type { TopicData } from "@/app/practice/data/types";

async function assertAuthorized() {
  const user = await getSessionPublicUser();
  return Boolean(user);
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

  const exportedValues = [...Object.values(sandbox.module.exports ?? {}), ...Object.values(sandbox.exports ?? {})];
  const candidate = exportedValues.find((value) => {
    if (!value || typeof value !== "object") return false;
    const maybeTopic = value as Partial<TopicData>;
    return (
      typeof maybeTopic.slug === "string" &&
      typeof maybeTopic.title === "string" &&
      typeof maybeTopic.intro === "string" &&
      Array.isArray(maybeTopic.levels)
    );
  });

  if (!candidate) {
    throw new Error("Uploaded file must export a TopicData object.");
  }

  return candidate as TopicData;
}

export async function GET() {
  try {
    if (!(await assertAuthorized())) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await connectDB();
    const tracks = await LearningTrack.find({})
      .select({ slug: 1, title: 1, intro: 1, kind: 1, status: 1, createdAt: 1, updatedAt: 1 })
      .sort({ createdAt: -1 })
      .lean();
    const levels = await LearningLevel.find({ trackId: { $in: tracks.map((track) => track._id) } })
      .select({ trackId: 1 })
      .lean();
    const levelIds = await LearningLevel.find({ trackId: { $in: tracks.map((track) => track._id) } })
      .select({ _id: 1, trackId: 1 })
      .lean();
    const questions = await LearningQuestion.find({ levelId: { $in: levelIds.map((level) => level._id) } })
      .select({ levelId: 1 })
      .lean();

    const levelCountByTrack = new Map<string, number>();
    levelIds.forEach((level) => {
      const key = String(level.trackId);
      levelCountByTrack.set(key, (levelCountByTrack.get(key) ?? 0) + 1);
    });
    const levelToTrack = new Map<string, string>();
    levelIds.forEach((level) => {
      levelToTrack.set(String(level._id), String(level.trackId));
    });
    const questionCountByTrack = new Map<string, number>();
    questions.forEach((question) => {
      const trackId = levelToTrack.get(String(question.levelId));
      if (!trackId) return;
      questionCountByTrack.set(trackId, (questionCountByTrack.get(trackId) ?? 0) + 1);
    });

    return NextResponse.json({
      practice: tracks.map((track) => ({
        id: String(track._id),
        slug: String(track.slug),
        title: String(track.title),
        intro: String(track.intro ?? ""),
        kind: track.kind,
        status: track.status,
        levels: levelCountByTrack.get(String(track._id)) ?? levels.filter((l) => String(l.trackId) === String(track._id)).length,
        questions: questionCountByTrack.get(String(track._id)) ?? 0,
        createdAt: track.createdAt,
        updatedAt: track.updatedAt,
      })),
    });
  } catch (error) {
    console.error("admin-panel/practice/get", error);
    return NextResponse.json({ error: "Failed to fetch practice data." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await assertAuthorized())) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const contentType = request.headers.get("content-type") ?? "";
    await connectDB();

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const uploadedFile = formData.get("questionsFile");
      if (!(uploadedFile instanceof File)) {
        return NextResponse.json({ error: "Please upload a TypeScript questions file." }, { status: 400 });
      }

      const fileSource = await uploadedFile.text();
      const topic = parseTopicDataFromUploadedTsFile(fileSource);
      const requestedLimitRaw = Number(formData.get("count") ?? 0);
      const requestedLimit = Number.isFinite(requestedLimitRaw) && requestedLimitRaw > 0 ? Math.floor(requestedLimitRaw) : Infinity;
      const topicKindRaw = String(formData.get("kind") ?? "track");
      const topicKind: "track" | "course" = topicKindRaw === "course" ? "course" : "track";

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
            kind: topic.kind === "course" ? "course" : topicKind,
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

      return NextResponse.json({
        imported: {
          trackId: String(track._id),
          slug: String(track.slug),
          insertedQuestions: insertedCount,
        },
      });
    }

    const body = (await request.json()) as {
      title?: string;
      slug?: string;
      intro?: string;
      kind?: "track" | "course";
    };
    if (!body.slug || !body.title) {
      return NextResponse.json({ error: "Title and slug are required." }, { status: 400 });
    }

    const normalizedSlug = body.slug.trim().toLowerCase();
    const language = await LearningLanguage.findOneAndUpdate(
      { slug: normalizedSlug },
      {
        $set: {
          name: body.title.trim(),
          description: String(body.intro ?? ""),
          status: "published",
        },
      },
      { upsert: true, new: true }
    );

    const created = await LearningTrack.create({
      languageId: language._id,
      title: body.title.trim(),
      slug: normalizedSlug,
      intro: String(body.intro ?? ""),
      kind: body.kind === "course" ? "course" : "track",
      status: "published",
      order: 0,
    });

    return NextResponse.json({ id: String(created._id) }, { status: 201 });
  } catch (error) {
    console.error("admin-panel/practice/create", error);
    return NextResponse.json({ error: "Failed to create/import practice data." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    if (!(await assertAuthorized())) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = (await request.json()) as {
      id?: string;
      data?: { title?: string; intro?: string; kind?: "track" | "course"; status?: "draft" | "published" | "archived" };
    };
    if (!body.id || !body.data) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    await connectDB();
    const updated = await LearningTrack.findByIdAndUpdate(
      body.id,
      { $set: body.data },
      { new: true }
    )
      .select({ _id: 1 })
      .lean();

    if (!updated) {
      return NextResponse.json({ error: "Practice record not found." }, { status: 404 });
    }

    return NextResponse.json({ id: String(updated._id) });
  } catch (error) {
    console.error("admin-panel/practice/update", error);
    return NextResponse.json({ error: "Failed to update practice data." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await assertAuthorized())) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = (await request.json()) as { id?: string };
    if (!body.id) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    await connectDB();
    const levels = await LearningLevel.find({ trackId: body.id }).select({ _id: 1 }).lean();
    await LearningQuestion.deleteMany({ levelId: { $in: levels.map((level) => level._id) } });
    await LearningLevel.deleteMany({ trackId: body.id });
    const deleted = await LearningTrack.findByIdAndDelete(body.id).lean();

    if (!deleted) {
      return NextResponse.json({ error: "Practice record not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("admin-panel/practice/delete", error);
    return NextResponse.json({ error: "Failed to delete practice data." }, { status: 500 });
  }
}
