import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const aiMockInterviewSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    showToUser: { type: Boolean, default: true, index: true },
    languages: { type: [String], default: [] },
    framework: { type: String, default: "", trim: true },
    role: { type: String, default: "", trim: true },
    seniority: { type: String, required: true, trim: true },
    focusAreas: { type: [String], required: true, validate: [(v: string[]) => v.length > 0, "Pick at least one focus area."] },
    notes: { type: String, default: "", trim: true, maxlength: 100 },
    status: {
      type: String,
      enum: ["created", "in_progress", "completed", "cancelled"],
      default: "created",
      index: true,
    },
    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    questions: {
      type: [
        {
          id: { type: String, required: true, trim: true },
          text: { type: String, required: true, trim: true },
          focusArea: { type: String, default: "", trim: true },
          difficulty: { type: String, default: "", trim: true },
        },
      ],
      default: [],
    },
    responses: {
      type: [
        {
          questionId: { type: String, required: true, trim: true },
          answer: { type: String, required: true, trim: true },
          scoreOutOf10: { type: Number, required: true, min: 0, max: 10 },
          verdict: {
            type: String,
            enum: ["correct", "partially_correct", "incorrect"],
            required: true,
          },
          strengths: { type: [String], default: [] },
          gaps: { type: [String], default: [] },
          provider: { type: String, default: "", trim: true },
          answeredAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export type AiMockInterviewDocument = InferSchemaType<typeof aiMockInterviewSchema> & {
  _id: mongoose.Types.ObjectId;
};

const existingModel = mongoose.models
  .AiMockInterview as Model<AiMockInterviewDocument> | undefined;

if (existingModel && !existingModel.schema.path("showToUser")) {
  existingModel.schema.add({
    showToUser: { type: Boolean, default: true, index: true },
  });
}

export const AiMockInterview: Model<AiMockInterviewDocument> =
  existingModel ||
  mongoose.model<AiMockInterviewDocument>("AiMockInterview", aiMockInterviewSchema);
