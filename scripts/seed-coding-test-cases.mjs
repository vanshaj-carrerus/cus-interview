import { config } from "dotenv";
import mongoose from "mongoose";

config({ path: ".env" });

const MONGODB_URI = process.env.MONGODB_URI?.trim();
if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set in .env");
  process.exit(1);
}

function looksLikeMcqPrompt(prompt) {
  const lower = prompt.trim().toLowerCase();
  return /^(what|which|how|why|when|where|who|is|are|does|do|can|should)\b/.test(
    lower
  );
}

function inferProblemTestCase(prompt) {
  if (looksLikeMcqPrompt(prompt)) {
    return { sampleInput: "", expectedOutput: "" };
  }

  const lower = prompt.toLowerCase();

  if (lower.includes("sum") && (lower.includes("array") || lower.includes("elements"))) {
    return { sampleInput: "1 2 3 4 5", expectedOutput: "15" };
  }

  const asksForMax =
    lower.includes("maximum") ||
    lower.includes("largest") ||
    lower.includes("max element") ||
    /\bmax\b/.test(lower);
  const asksForMin =
    lower.includes("minimum") ||
    lower.includes("smallest") ||
    lower.includes("min element") ||
    /\bmin\b/.test(lower);

  if (asksForMax && asksForMin) {
    return { sampleInput: "3 7 2 9 1", expectedOutput: "9 1" };
  }

  if (asksForMax) {
    return { sampleInput: "3 7 2 9 1", expectedOutput: "9" };
  }

  if (asksForMin) {
    return { sampleInput: "3 7 2 9 1", expectedOutput: "1" };
  }

  if (lower.includes("reverse")) {
    return { sampleInput: "hello", expectedOutput: "olleh" };
  }

  if (lower.includes("factorial")) {
    return { sampleInput: "5", expectedOutput: "120" };
  }

  if (/\beven\b/.test(lower) || /\bodd\b/.test(lower)) {
    return { sampleInput: "4", expectedOutput: "even" };
  }

  if (lower.includes("parking") && lower.includes("system")) {
    return {
      sampleInput: "1 1 0\n1\n1\n2\n3",
      expectedOutput: "true\ntrue\nfalse\nfalse",
    };
  }

  if (lower.includes("two sum") || lower.includes("pair with sum")) {
    return { sampleInput: "2 7 11 15\n9", expectedOutput: "0 1" };
  }

  if (lower.includes("palindrome")) {
    return { sampleInput: "racecar", expectedOutput: "true" };
  }

  if (lower.includes("fibonacci")) {
    return { sampleInput: "6", expectedOutput: "8" };
  }

  if (
    lower.includes("count") &&
    (lower.includes("array") || lower.includes("element"))
  ) {
    return { sampleInput: "1 2 3 4 5", expectedOutput: "5" };
  }

  if (lower.includes("linear search") || lower.includes("find index")) {
    return { sampleInput: "10 20 30 40\n30", expectedOutput: "2" };
  }

  if (lower.includes("binary search")) {
    return { sampleInput: "1 3 5 7 9\n7", expectedOutput: "3" };
  }

  return { sampleInput: "", expectedOutput: "" };
}

const questionSchema = new mongoose.Schema(
  {
    prompt: String,
    sampleInput: { type: String, default: "" },
    expectedOutput: { type: String, default: "" },
    questionType: { type: String, default: "coding" },
    status: String,
  },
  { collection: "learningquestions" }
);

const LearningQuestion =
  mongoose.models.SeedLearningQuestion ||
  mongoose.model("SeedLearningQuestion", questionSchema);

async function main() {
  await mongoose.connect(MONGODB_URI);

  const resetResult = await LearningQuestion.updateMany(
    {},
    { $set: { sampleInput: "", expectedOutput: "" } }
  );
  console.log(`Reset test cases on ${resetResult.modifiedCount} question(s).`);

  const questions = await LearningQuestion.find({ status: "published" }).lean();

  let updated = 0;
  let skipped = 0;

  for (const question of questions) {
    const inferred = inferProblemTestCase(String(question.prompt ?? ""));
    if (!inferred.expectedOutput.trim()) {
      skipped += 1;
      continue;
    }

    await LearningQuestion.updateOne(
      { _id: question._id },
      {
        $set: {
          sampleInput: inferred.sampleInput,
          expectedOutput: inferred.expectedOutput,
          questionType: question.questionType || "coding",
        },
      }
    );

    updated += 1;
    console.log(`Updated ${question._id}: ${String(question.prompt).slice(0, 60)}...`);
  }

  console.log(`Done. Updated ${updated} question(s), skipped ${skipped}.`);
  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
