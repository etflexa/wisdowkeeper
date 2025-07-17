import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    type: { type: String, require: true },
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    cpf: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    enterpriseId: { type: mongoose.Schema.Types.ObjectId, required: true },
    password: { type: String, required: true, select: false },
    passwordDecode: { type: String, required: true, select: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

const User = mongoose.model("User", userSchema);

export { User };
