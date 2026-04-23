import mongoose, { InferSchemaType, Model, Schema } from "mongoose";

const learningTaskSchema = new Schema(
  {
    levelId: { type: Schema.Types.ObjectId, ref: "LearningLevel", required: true, index: true },
    externalId: { type: String, required: true, trim: true, index: true },
    prompt: { type: String, required: true, trim: true },
    instructions: { type: String, default: "", trim: true },
    evaluationType: {
      type: String,
      enum: ["manual", "exact_match"],
      default: "exact_match",
    },
    expectedAnswer: { type: Schema.Types.Mixed, default: null, select: false },
    tags: { type: [String], default: [] },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
    order: { type: Number, default: 0 },
    version: { type: Number, default: 1 },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
      index: true,
    },
  },
  { timestamps: true }
);

learningTaskSchema.index({ levelId: 1, order: 1, status: 1 });
learningTaskSchema.index({ levelId: 1, externalId: 1 }, { unique: true });

export type LearningTaskDocument = InferSchemaType<typeof learningTaskSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const LearningTask: Model<LearningTaskDocument> =
  (mongoose.models.LearningTask as Model<LearningTaskDocument>) ||
  mongoose.model<LearningTaskDocument>("LearningTask", learningTaskSchema);
