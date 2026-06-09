"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type OptionItem = { id: string; text: string };

type QuestionItem = {
  id: string;
  externalId: string;
  prompt: string;
  options: OptionItem[];
  correctOptionId: string;
  explanation: string;
  difficulty?: "easy" | "medium" | "hard";
};

type LevelItem = {
  id: string;
  levelNumber: number;
  title: string;
  questions: QuestionItem[];
};

type Props = {
  levels: LevelItem[];
};

type ModalState =
  | { mode: "add"; levelId: string; levelLabel: string }
  | { mode: "edit"; levelId: string; levelLabel: string; question: QuestionItem }
  | null;

export default function QuestionTableManager({ levels }: Props) {
  const router = useRouter();
  const [modalState, setModalState] = useState<ModalState>(null);
  const [saving, setSaving] = useState(false);

  async function deleteQuestion(id: string) {
    const response = await fetch("/api/learning/admin/content", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entity: "question", id }),
      credentials: "same-origin",
    });
    if (!response.ok) {
      return;
    }
    router.refresh();
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!modalState) return;
    const formData = new FormData(event.currentTarget);
    const externalId = String(formData.get("externalId") ?? "").trim();
    const prompt = String(formData.get("prompt") ?? "").trim();
    const optionsCsv = String(formData.get("options") ?? "");
    const explanation = String(formData.get("explanation") ?? "").trim();
    const correctOptionId = Number(formData.get("correctOptionId") ?? 0);
    const difficulty = String(formData.get("difficulty") ?? "medium");

    const options = optionsCsv
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((text, index) => ({ id: String(index), text }));
    const normalizedCorrectOptionId =
      Number.isFinite(correctOptionId) &&
      correctOptionId >= 0 &&
      correctOptionId < options.length
        ? String(correctOptionId)
        : "0";

    setSaving(true);
    try {
      if (modalState.mode === "add") {
        const response = await fetch("/api/learning/admin/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({
            entity: "question",
            data: {
              levelId: modalState.levelId,
              externalId,
              prompt,
              options,
              correctOptionId: normalizedCorrectOptionId,
              explanation,
              difficulty,
              status: "published",
            },
          }),
        });
        if (!response.ok) return;
      } else {
        const response = await fetch("/api/learning/admin/content", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({
            entity: "question",
            id: modalState.question.id,
            data: {
              externalId,
              prompt,
              options,
              correctOptionId: normalizedCorrectOptionId,
              explanation,
              difficulty,
            },
          }),
        });
        if (!response.ok) return;
      }
      setModalState(null);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="space-y-6">
        {levels.map((level) => (
          <div key={level.id} className="rounded-xl border border-primary/20 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-secondary">
                Level {level.levelNumber}: {level.title}
              </h4>
              <button
                type="button"
                className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-white"
                onClick={() =>
                  setModalState({
                    mode: "add",
                    levelId: level.id,
                    levelLabel: `Level ${level.levelNumber}`,
                  })
                }
              >
                Add Question
              </button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-primary/20">
              <table className="min-w-full text-sm">
                <thead className="bg-primary/10 text-secondary">
                  <tr>
                    <th className="px-3 py-2 text-left">ID</th>
                    <th className="px-3 py-2 text-left">Prompt</th>
                    <th className="px-3 py-2 text-left">Options</th>
                    <th className="px-3 py-2 text-left">Correct</th>
                    <th className="px-3 py-2 text-left">Difficulty</th>
                    <th className="px-3 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/10">
                  {level.questions.map((question) => (
                    <tr key={question.id}>
                      <td className="px-3 py-2 text-secondary/70">{question.externalId}</td>
                      <td className="px-3 py-2 text-secondary">{question.prompt}</td>
                      <td className="px-3 py-2 text-secondary/70">
                        {question.options.map((option) => option.text).join(", ")}
                      </td>
                      <td className="px-3 py-2 text-secondary/70">
                        {question.options.find((option) => option.id === question.correctOptionId)?.text ?? "-"}
                      </td>
                      <td className="px-3 py-2">
                        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${
                          question.difficulty === "easy"
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                            : question.difficulty === "hard"
                              ? "bg-rose-50 text-rose-700 ring-rose-600/20"
                              : "bg-amber-50 text-amber-700 ring-amber-600/20"
                        }`}>
                          {(question.difficulty ?? "medium").toUpperCase()}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="rounded-md border border-primary/30 px-2 py-1 text-xs text-primary hover:bg-primary/5"
                            onClick={() =>
                              setModalState({
                                mode: "edit",
                                levelId: level.id,
                                levelLabel: `Level ${level.levelNumber}`,
                                question,
                              })
                            }
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="rounded-md border border-primary/30 px-2 py-1 text-xs text-primary hover:bg-primary/5"
                            onClick={() => void deleteQuestion(question.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {level.questions.length === 0 ? (
                    <tr>
                      <td className="px-3 py-4 text-secondary/60" colSpan={6}>
                        No questions added yet.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {modalState ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-secondary">
                {modalState.mode === "add" ? "Add Question" : "Edit Question"} - {modalState.levelLabel}
              </h3>
              <button
                type="button"
                className="text-sm text-secondary/70 hover:text-secondary"
                onClick={() => setModalState(null)}
              >
                Close
              </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-secondary/70 mb-1">Question ID</label>
                  <input
                    name="externalId"
                    required
                    defaultValue={modalState.mode === "edit" ? modalState.question.externalId : ""}
                    placeholder="Question ID"
                    className="w-full rounded-lg border border-primary/20 px-3 py-2 text-sm text-secondary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-secondary/70 mb-1">Difficulty</label>
                  <select
                    name="difficulty"
                    defaultValue={modalState.mode === "edit" ? modalState.question.difficulty ?? "medium" : "medium"}
                    className="w-full rounded-lg border border-primary/20 px-3 py-2 text-sm text-secondary bg-white"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondary/70 mb-1">Prompt</label>
                <textarea
                  name="prompt"
                  required
                  defaultValue={modalState.mode === "edit" ? modalState.question.prompt : ""}
                  placeholder="Question prompt"
                  className="h-20 w-full rounded-lg border border-primary/20 px-3 py-2 text-sm text-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondary/70 mb-1">Options (Comma separated)</label>
                <input
                  name="options"
                  required
                  defaultValue={
                    modalState.mode === "edit"
                      ? modalState.question.options.map((item) => item.text).join(", ")
                      : ""
                  }
                  placeholder="Option A, Option B, Option C, Option D"
                  className="w-full rounded-lg border border-primary/20 px-3 py-2 text-sm text-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondary/70 mb-1">Correct Option Index (0-based)</label>
                <input
                  name="correctOptionId"
                  type="number"
                  min="0"
                  defaultValue={modalState.mode === "edit" ? Number(modalState.question.correctOptionId) : 0}
                  className="w-full rounded-lg border border-primary/20 px-3 py-2 text-sm text-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondary/70 mb-1">Explanation</label>
                <textarea
                  name="explanation"
                  defaultValue={modalState.mode === "edit" ? modalState.question.explanation : ""}
                  placeholder="Explanation"
                  className="h-20 w-full rounded-lg border border-primary/20 px-3 py-2 text-sm text-secondary"
                />
              </div>

              <button
                disabled={saving}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
