import "dotenv/config";
import mongoose from "mongoose";

const userId = "6a1d178428949879299f73e1";
const questionId = new mongoose.Types.ObjectId("6a26a6504318b4fda792d22e");

await mongoose.connect(process.env.MONGODB_TRACKING_URI);

const result = await mongoose.connection.collection("userlearningprofiles").findOneAndUpdate(
  {
    userId: new mongoose.Types.ObjectId(userId),
    solvedQuestionIds: { $ne: questionId },
  },
  {
    $addToSet: { solvedQuestionIds: questionId },
    $inc: { "totals.distinctQuestionsSolved": 1 },
    $set: { lastActiveAt: new Date() },
    $setOnInsert: {
      userId: new mongoose.Types.ObjectId(userId),
      languages: [],
      totals: {
        totalAttempts: 0,
        totalCleared: 0,
        totalQuestionsAttempted: 0,
        totalTasksAttempted: 0,
        totalLevelsCompleted: 0,
        distinctQuestionsSolved: 0,
      },
    },
  },
  { upsert: true, returnDocument: "after" }
);

console.log("profile update", {
  matched: Boolean(result),
  distinctQuestionsSolved: result?.totals?.distinctQuestionsSolved,
  solvedCount: result?.solvedQuestionIds?.length,
});

await mongoose.disconnect();
