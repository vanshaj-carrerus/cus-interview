import "dotenv/config";
import mongoose from "mongoose";

const userId = "6a1d178428949879299f73e1";
const questionId = "69f9b7980985324693fd813e";

await mongoose.connect(process.env.MONGODB_URI);
const question = await mongoose.connection
  .collection("learningquestions")
  .findOne({ _id: new mongoose.Types.ObjectId(questionId) });
console.log("question found", Boolean(question), question?.status);

const level = await mongoose.connection
  .collection("learninglevels")
  .findOne({ _id: question.levelId, status: "published" });
console.log("level found", Boolean(level));

const track = await mongoose.connection
  .collection("learningtracks")
  .findOne({ _id: level.trackId, status: "published" });
console.log("track found", Boolean(track));

const language = await mongoose.connection
  .collection("learninglanguages")
  .findOne({ _id: track.languageId, status: "published" });
console.log("language found", Boolean(language));

await mongoose.disconnect();

await mongoose.connect(process.env.MONGODB_TRACKING_URI);
const existing = await mongoose.connection.collection("userlearningattempts").findOne({
  $or: [{ userId: new mongoose.Types.ObjectId(userId) }, { userId }],
  entityType: "question",
  entityId: question._id,
  isCorrect: true,
});
console.log("existing attempt", Boolean(existing));

if (!existing) {
  const doc = {
    userId: new mongoose.Types.ObjectId(userId),
    entityType: "question",
    entityId: question._id,
    languageId: language._id,
    trackId: track._id,
    levelId: level._id,
    levelNumber: level.levelNumber,
    submittedAnswer: "compiler:passed",
    isCorrect: true,
    scoreAwarded: 1,
    outcome: "passed",
    latencyMs: null,
    attemptedAt: new Date(),
  };
  const insert = await mongoose.connection.collection("userlearningattempts").insertOne(doc);
  console.log("inserted", insert.insertedId.toString());
}

const count = await mongoose.connection.collection("userlearningattempts").countDocuments({
  $or: [{ userId: new mongoose.Types.ObjectId(userId) }, { userId }],
  entityType: "question",
  isCorrect: true,
});
console.log("correct question attempts", count);
await mongoose.disconnect();
