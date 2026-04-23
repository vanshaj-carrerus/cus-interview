import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { LearningLevel, LearningQuestion, LearningTask, LearningTrack } from "@/models/learning";
import QuestionTableManager from "../../components/question-table-manager";

async function updateTrackAction(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const intro = String(formData.get("intro") ?? "").trim();
  if (!id || !title) return;
  await connectDB();
  await LearningTrack.findByIdAndUpdate(id, { $set: { title, intro } });
  revalidatePath("/admin-panel");
}

async function deleteTrackAction(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await connectDB();
  const levels = await LearningLevel.find({ trackId: id }).select({ _id: 1 }).lean();
  const levelIds = levels.map((item) => item._id);
  await LearningQuestion.deleteMany({ levelId: { $in: levelIds } });
  await LearningTask.deleteMany({ levelId: { $in: levelIds } });
  await LearningLevel.deleteMany({ trackId: id });
  await LearningTrack.findByIdAndDelete(id);
  revalidatePath("/admin-panel");
  redirect("/admin-panel/learning-tracks");
}

async function addLevelAction(formData: FormData) {
  "use server";
  const trackId = String(formData.get("trackId") ?? "");
  const levelNumber = Number(formData.get("levelNumber") ?? 1);
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const passScore = Number(formData.get("passScore") ?? 1);
  if (!trackId || !title || !Number.isFinite(levelNumber)) return;
  await connectDB();
  await LearningLevel.findOneAndUpdate(
    { trackId, levelNumber },
    { $set: { title, description, passScore, status: "published" } },
    { upsert: true, new: true }
  );
  revalidatePath("/admin-panel");
}

async function updateLevelAction(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const passScore = Number(formData.get("passScore") ?? 1);
  if (!id || !title) return;
  await connectDB();
  await LearningLevel.findByIdAndUpdate(id, { $set: { title, description, passScore } });
  revalidatePath("/admin-panel");
}

async function deleteLevelAction(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await connectDB();
  await LearningQuestion.deleteMany({ levelId: id });
  await LearningTask.deleteMany({ levelId: id });
  await LearningLevel.findByIdAndDelete(id);
  revalidatePath("/admin-panel");
}

export default async function LearningTrackDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectDB();
  const track = await LearningTrack.findOne({ slug, kind: "track" }).lean();
  if (!track) {
    return <p className="text-sm text-primary">Track not found.</p>;
  }

  const levels = await LearningLevel.find({ trackId: track._id }).sort({ levelNumber: 1 }).lean();
  const questions = await LearningQuestion.find({ levelId: { $in: levels.map((item) => item._id) } })
    .select("+correctOptionId")
    .sort({ createdAt: -1 })
    .lean();
  const levelsForTable = levels.map((level) => ({
    id: String(level._id),
    levelNumber: Number(level.levelNumber),
    title: String(level.title),
    questions: questions
      .filter((question) => String(question.levelId) === String(level._id))
      .map((question) => ({
        id: String(question._id),
        externalId: String(question.externalId ?? ""),
        prompt: String(question.prompt ?? ""),
        options: (question.options ?? []).map((option) => ({
          id: String(option.id),
          text: String(option.text),
        })),
        correctOptionId: String(question.correctOptionId ?? "0"),
        explanation: String(question.explanation ?? ""),
      })),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-secondary">{String(track.title)}</h2>
        <p className="mt-1 text-sm text-secondary/70">{String(track.intro ?? "")}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <form action={updateTrackAction} className="rounded-xl border border-primary/20 bg-white p-4">
          <p className="mb-3 text-sm font-semibold text-secondary">Edit Track</p>
          <input type="hidden" name="id" value={String(track._id)} />
          <div className="space-y-2">
            <input name="title" defaultValue={String(track.title)} className="w-full rounded-lg border border-primary/20 bg-white px-3 py-2 text-sm text-secondary" />
            <textarea name="intro" defaultValue={String(track.intro ?? "")} className="h-24 w-full rounded-lg border border-primary/20 bg-white px-3 py-2 text-sm text-secondary" />
            <button className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white">Save Track</button>
          </div>
        </form>

        <form action={deleteTrackAction} className="rounded-xl border border-primary/20 bg-white p-4">
          <p className="mb-3 text-sm font-semibold text-secondary">Delete Track</p>
          <input type="hidden" name="id" value={String(track._id)} />
          <p className="mb-3 text-xs text-secondary/70">This removes the track with all levels and questions.</p>
          <button className="rounded-lg border border-primary/30 px-3 py-2 text-sm text-primary hover:bg-primary/5">
            Delete Permanently
          </button>
        </form>
      </div>

      <form action={addLevelAction} className="rounded-xl border border-primary/20 bg-white p-4">
        <p className="mb-3 text-sm font-semibold text-secondary">Add Level</p>
        <input type="hidden" name="trackId" value={String(track._id)} />
        <div className="grid gap-2 md:grid-cols-2">
          <input name="levelNumber" type="number" min="1" defaultValue="1" className="rounded-lg border border-primary/20 bg-white px-3 py-2 text-sm text-secondary" />
          <input name="passScore" type="number" min="1" defaultValue="1" className="rounded-lg border border-primary/20 bg-white px-3 py-2 text-sm text-secondary" />
          <input name="title" placeholder="Level title" className="rounded-lg border border-primary/20 bg-white px-3 py-2 text-sm text-secondary md:col-span-2" />
          <textarea name="description" placeholder="Level description" className="h-20 rounded-lg border border-primary/20 bg-white px-3 py-2 text-sm text-secondary md:col-span-2" />
        </div>
        <button className="mt-3 rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-white">Add Level</button>
      </form>

      <div className="space-y-4">
        {levels.map((level) => (
          <section key={String(level._id)} className="rounded-xl border border-primary/20 bg-white p-4">
            <form action={updateLevelAction} className="grid gap-2 md:grid-cols-2">
              <input type="hidden" name="id" value={String(level._id)} />
              <input name="title" defaultValue={String(level.title)} className="rounded-lg border border-primary/20 bg-white px-3 py-2 text-sm text-secondary md:col-span-2" />
              <textarea name="description" defaultValue={String(level.description ?? "")} className="h-20 rounded-lg border border-primary/20 bg-white px-3 py-2 text-sm text-secondary md:col-span-2" />
              <input name="passScore" type="number" min="1" defaultValue={Number(level.passScore)} className="rounded-lg border border-primary/20 bg-white px-3 py-2 text-sm text-secondary" />
              <div className="flex items-center gap-2">
                <button className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white">Save Level</button>
              </div>
            </form>
            <form action={deleteLevelAction} className="mt-2">
              <input type="hidden" name="id" value={String(level._id)} />
              <button className="rounded-lg border border-primary/30 px-3 py-1.5 text-xs text-primary hover:bg-primary/5">Delete Level</button>
            </form>

          </section>
        ))}
      </div>

      <QuestionTableManager levels={levelsForTable} />
    </div>
  );
}
