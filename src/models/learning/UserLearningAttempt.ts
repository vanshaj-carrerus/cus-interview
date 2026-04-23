import mongoose, { Connection, InferSchemaType, Model, Schema } from "mongoose";

export const userLearningAttemptSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    entityType: { type: String, enum: ["question", "task"], required: true, index: true },
    entityId: { type: Schema.Types.ObjectId, required: true, index: true },
    languageId: { type: Schema.Types.ObjectId, ref: "LearningLanguage", required: true, index: true },
    trackId: { type: Schema.Types.ObjectId, ref: "LearningTrack", required: true, index: true },
    levelId: { type: Schema.Types.ObjectId, ref: "LearningLevel", required: true, index: true },
    levelNumber: { type: Number, required: true },
    submittedAnswer: { type: Schema.Types.Mixed, default: null, select: false },
    isCorrect: { type: Boolean, required: true },
    scoreAwarded: { type: Number, required: true, default: 0 },
    outcome: { type: String, enum: ["passed", "failed"], required: true },
    latencyMs: { type: Number, default: null },
    attemptedAt: { type: Date, required: true, default: Date.now, index: true },
  },
  { timestamps: true }
);

userLearningAttemptSchema.index({
  userId: 1,
  languageId: 1,
  trackId: 1,
  levelId: 1,
  attemptedAt: -1,
});
userLearningAttemptSchema.index({ userId: 1, entityType: 1, entityId: 1, attemptedAt: -1 });

export type UserLearningAttemptDocument = InferSchemaType<typeof userLearningAttemptSchema> & {
  _id: mongoose.Types.ObjectId;
};

export function getUserLearningAttemptModel(conn: Connection): Model<UserLearningAttemptDocument> {
  return (
    (conn.models.UserLearningAttempt as Model<UserLearningAttemptDocument>) ||
    conn.model<UserLearningAttemptDocument>("UserLearningAttempt", userLearningAttemptSchema)
  );
}
