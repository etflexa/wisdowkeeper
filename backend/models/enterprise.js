import mongoose from "mongoose";

const { Schema } = mongoose;

const enterpriseSchema = new Schema(
  {
    name: { type: String, require: true },
    cnpj: { type: String, require: true, select: false, unique: true },
    email: { type: String, require: true, select: false, unique: true },
    password: { type: String, require: true, select: false },
    users: [{ type: mongoose.Schema.Types.ObjectId }],
    solutions: [{ type: mongoose.Schema.Types.ObjectId }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

const Enterprise = mongoose.model("Enterprise", enterpriseSchema);

export { Enterprise };
