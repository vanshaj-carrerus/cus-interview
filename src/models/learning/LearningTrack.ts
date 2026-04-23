import mongoose, { InferSchemaType, Model, Schema } from "mongoose";

const learningTrackSchema = new Schema(
  {
    languageId: { type: Schema.Types.ObjectId, ref: "LearningLanguage", required: true, index: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    title: { type: String, required: true, trim: true },
    intro: { type: String, default: "", trim: true },
    kind: { type: String, enum: ["track", "course"], default: "track", index: true },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
      index: true,
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

learningTrackSchema.index({ languageId: 1, kind: 1, status: 1, order: 1 });

export type LearningTrackDocument = InferSchemaType<typeof learningTrackSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const LearningTrack: Model<LearningTrackDocument> =
  (mongoose.models.LearningTrack as Model<LearningTrackDocument>) ||
  mongoose.model<LearningTrackDocument>("LearningTrack", learningTrackSchema);
