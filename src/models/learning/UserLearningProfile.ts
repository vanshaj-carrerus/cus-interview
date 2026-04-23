import mongoose, { Connection, InferSchemaType, Model, Schema } from "mongoose";

const levelProgressSchema = new Schema(
  {
    levelId: { type: Schema.Types.ObjectId, ref: "LearningLevel", required: true },
    levelNumber: { type: Number, required: true },
    attempts: { type: Number, default: 0 },
    cleared: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    firstPassedAt: { type: Date, default: null },
    lastAttemptAt: { type: Date, default: null },
  },
  { _id: false }
);

const trackProgressSchema = new Schema(
  {
    trackId: { type: Schema.Types.ObjectId, ref: "LearningTrack", required: true },
    trackSlug: { type: String, required: true, trim: true },
    totalLevels: { type: Number, default: 0 },
    completedLevels: { type: Number, default: 0 },
    attempts: { type: Number, default: 0 },
    cleared: { type: Number, default: 0 },
    levels: { type: [levelProgressSchema], default: [] },
  },
  { _id: false }
);

const languageProgressSchema = new Schema(
  {
    languageId: { type: Schema.Types.ObjectId, ref: "LearningLanguage", required: true },
    languageSlug: { type: String, required: true, trim: true },
    attempts: { type: Number, default: 0 },
    cleared: { type: Number, default: 0 },
    tracks: { type: [trackProgressSchema], default: [] },
  },
  { _id: false }
);

export const userLearningProfileSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    totals: {
      totalAttempts: { type: Number, default: 0 },
      totalCleared: { type: Number, default: 0 },
      totalQuestionsAttempted: { type: Number, default: 0 },
      totalTasksAttempted: { type: Number, default: 0 },
      totalLevelsCompleted: { type: Number, default: 0 },
    },
    languages: { type: [languageProgressSchema], default: [] },
    lastActiveAt: { type: Date, default: null, index: true },
  },
  { timestamps: true }
);

export type UserLearningProfileDocument = InferSchemaType<typeof userLearningProfileSchema> & {
  _id: mongoose.Types.ObjectId;
};

export function getUserLearningProfileModel(conn: Connection): Model<UserLearningProfileDocument> {
  return (
    (conn.models.UserLearningProfile as Model<UserLearningProfileDocument>) ||
    conn.model<UserLearningProfileDocument>("UserLearningProfile", userLearningProfileSchema)
  );
}
