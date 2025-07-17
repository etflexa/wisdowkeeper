import mongoose from "mongoose";

const { Schema } = mongoose;

const solutionSchema = new Schema(
  {
    enterpriseId: { type: mongoose.Schema.Types.ObjectId, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    title: { type: String, require: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    videoURL: { type: String },
    files: [
      {
        name: { type: String },
        url: { type: String },
        extention: { type: String },
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

const solutionCategorySchema = new Schema(
  {
    enterpriseId: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);

const Solution = mongoose.model("Solution", solutionSchema);

const SolutionCategory = mongoose.model(
  "SolutionCategory",
  solutionCategorySchema
);

export { Solution, SolutionCategory };
