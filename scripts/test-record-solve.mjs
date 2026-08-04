import "dotenv/config";
import mongoose from "mongoose";

// Minimal test via direct DB + service logic
const userId = "6a1d178428949879299f73e1";
const questionId = "6a26a6504318b4fda792d22e";

process.env.NODE_OPTIONS = "--no-warnings";
const { recordCompilerQuestionSolve } = await import("../src/lib/learning/service.ts");

const result = await recordCompilerQuestionSolve({ userId, questionId });
console.log("recordCompilerQuestionSolve result:", result);

await mongoose.disconnect();
