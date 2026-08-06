import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

const projectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    stack: { type: String, required: true, trim: true },
    difficulty: { type: String, required: true, trim: true },
    icon: { type: String, required: true, trim: true },
    details: { type: String, default: "", trim: true }, // For the detailed view modal
  },
  { timestamps: true }
);

export type ProjectDocument = InferSchemaType<typeof projectSchema> & {
  _id: mongoose.Types.ObjectId;
};

// In Next.js dev server, delete cached model to prevent stale schema validation errors
if (process.env.NODE_ENV !== "production" && mongoose.models.Project) {
  delete mongoose.models.Project;
}

export const Project: Model<ProjectDocument> =
  (mongoose.models.Project as Model<ProjectDocument>) ||
  mongoose.model<ProjectDocument>("Project", projectSchema);
