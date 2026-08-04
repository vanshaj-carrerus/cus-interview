import "dotenv/config";
import mongoose from "mongoose";

const userId = "6a1d178428949879299f73e1";

await mongoose.connect(process.env.MONGODB_TRACKING_URI);
const attempts = await mongoose.connection
  .collection("userlearningattempts")
  .find({
    $or: [{ userId: new mongoose.Types.ObjectId(userId) }, { userId }],
  })
  .toArray();
console.log("attempts count", attempts.length);
if (attempts.length) {
  console.log("latest", JSON.stringify(attempts[attempts.length - 1], null, 2));
}
await mongoose.disconnect();

await mongoose.connect(process.env.MONGODB_URI);
const user = await mongoose.connection
  .collection("users")
  .findOne({ _id: new mongoose.Types.ObjectId(userId) });
console.log("subscription", JSON.stringify(user?.subscription, null, 2));
await mongoose.disconnect();
