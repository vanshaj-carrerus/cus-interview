import mongoose, { InferSchemaType, Model, Schema } from "mongoose";

const questionOptionSchema = new Schema(
  {
    id: { type: String, required: true, trim: true },
    text: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const learningQuestionSchema = new Schema(
  {
    levelId: { type: Schema.Types.ObjectId, ref: "LearningLevel", required: true, index: true },
    externalId: { type: String, required: true, trim: true, index: true },
    prompt: { type: String, required: true, trim: true },
    options: { type: [questionOptionSchema], default: [] },
    correctOptionId: { type: String, required: true, select: false },
    explanation: { type: String, default: "", trim: true },
    tags: { type: [String], default: [] },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
    questionType: {
      type: String,
      enum: ["mcq", "coding"],
      default: "coding",
    },
    sampleInput: { type: String, default: "" },
    expectedOutput: { type: String, default: "" },
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

learningQuestionSchema.index({ levelId: 1, order: 1, status: 1 });
learningQuestionSchema.index({ levelId: 1, externalId: 1 }, { unique: true });

export type LearningQuestionDocument = InferSchemaType<typeof learningQuestionSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const LearningQuestion: Model<LearningQuestionDocument> =
  (mongoose.models.LearningQuestion as Model<LearningQuestionDocument>) ||
  mongoose.model<LearningQuestionDocument>("LearningQuestion", learningQuestionSchema);
