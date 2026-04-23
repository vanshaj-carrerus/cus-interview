import { connectTrackingDB } from "@/lib/mongodb-tracking";
import { getUserLearningAttemptModel } from "./UserLearningAttempt";
import { getUserLearningProfileModel } from "./UserLearningProfile";

export async function getTrackingModels() {
  const conn = await connectTrackingDB();
  return {
    UserLearningAttempt: getUserLearningAttemptModel(conn),
    UserLearningProfile: getUserLearningProfileModel(conn),
  };
}
