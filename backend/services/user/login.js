import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import "dotenv/config";
import { AppError } from "../../middleware/appError.js";
import { User } from "../../models/user.js";
import { Enterprise } from "../../models/enterprise.js";

export async function loginUser(data) {
  const { email, password } = data;

  const user = await User.findOne({ email }).select("+password");

  const enterprise = await Enterprise.findById(user.enterpriseId);

  if (!enterprise.isActive) {
    throw new AppError("Empresa com atividade suspensa");
  }

  if (!user) {
    throw new AppError("credenciais inválidas");
  }

  const comparePassword = (param1, param2) =>
    new Promise((resolve, reject) => {
      bcrypt.compare(param1, param2, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("credenciais inválidas");
  }

  if (!user.isActive) {
    throw new AppError(
      "Usuário sem permissão para logar. Contate a empresa para regularizar seu cadastro",
      401
    );
  }

  const token = jwt.sign({}, process.env.JWT_SECRET_KEY, {
    expiresIn: "10d",
    subject: user._id.toString(),
  });

  const refreshToken = jwt.sign({}, process.env.JWT_REFRESH_SECRET_KEY, {
    expiresIn: "30d",
    subject: user._id.toString(),
  });

  let objUser = user.toObject();

  delete objUser.password;

  return {
    user: objUser,
    token,
    refreshToken,
  };
}
