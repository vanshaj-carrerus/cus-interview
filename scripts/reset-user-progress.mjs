import "dotenv/config";
import mongoose from "mongoose";

const userId = process.argv[2];
if (!userId) {
  console.error("Usage: node scripts/reset-user-progress.mjs <userId>");
  process.exit(1);
}

const oid = new mongoose.Types.ObjectId(userId);
const userMatch = { $or: [{ userId: oid }, { userId }] };

await mongoose.connect(process.env.MONGODB_TRACKING_URI);
const attempts = mongoose.connection.collection("userlearningattempts");
const profile = mongoose.connection.collection("userlearningprofiles");

const deleted = await attempts.deleteMany(userMatch);
await profile.updateOne(
  { userId: oid },
  {
    $set: {
      totals: {
        totalAttempts: 0,
        totalCleared: 0,
        totalQuestionsAttempted: 0,
        totalTasksAttempted: 0,
        totalLevelsCompleted: 0,
      },
      languages: [],
      lastActiveAt: null,
    },
    $setOnInsert: { userId: oid },
  },
  { upsert: true },
);

console.log(`Deleted ${deleted.deletedCount} attempts and zeroed profile for ${userId}`);
await mongoose.disconnect();
