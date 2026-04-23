import mongoose, { InferSchemaType, Model, Schema } from "mongoose";

const learningLanguageSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
      index: true,
    },
    order: { type: Number, default: 0 },
    icon: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

learningLanguageSchema.index({ status: 1, order: 1, slug: 1 });

export type LearningLanguageDocument = InferSchemaType<typeof learningLanguageSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const LearningLanguage: Model<LearningLanguageDocument> =
  (mongoose.models.LearningLanguage as Model<LearningLanguageDocument>) ||
  mongoose.model<LearningLanguageDocument>("LearningLanguage", learningLanguageSchema);
