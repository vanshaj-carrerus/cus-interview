import mongoose, { InferSchemaType, Model, Schema } from "mongoose";

const learningLevelSchema = new Schema(
  {
    trackId: { type: Schema.Types.ObjectId, ref: "LearningTrack", required: true, index: true },
    levelNumber: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    passScore: { type: Number, required: true, default: 1, min: 1 },
    order: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
      index: true,
    },
  },
  { timestamps: true }
);

learningLevelSchema.index({ trackId: 1, levelNumber: 1 }, { unique: true });
learningLevelSchema.index({ trackId: 1, status: 1, order: 1 });

export type LearningLevelDocument = InferSchemaType<typeof learningLevelSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const LearningLevel: Model<LearningLevelDocument> =
  (mongoose.models.LearningLevel as Model<LearningLevelDocument>) ||
  mongoose.model<LearningLevelDocument>("LearningLevel", learningLevelSchema);
