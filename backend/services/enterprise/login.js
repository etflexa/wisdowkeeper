import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import "dotenv/config";
import { Enterprise } from "../../models/enterprise.js";
import { AppError } from "../../middleware/appError.js";

export async function loginEnterprise(data) {
  const { email, password } = data;

  let enterprise = await Enterprise.findOne({ email }).select("+password");

  if (!enterprise) {
    throw new AppError("credenciais inválidas");
  }

  const comparePassword = (param1, param2) =>
    new Promise((resolve, reject) => {
      bcrypt.compare(param1, param2, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });

  const isPasswordValid = await comparePassword(password, enterprise.password);

  if (!isPasswordValid) {
    throw new AppError("credenciais inválidas");
  }

  if (!enterprise.isActive) {
    enterprise.isActive = true;
    enterprise = await enterprise.save();
  }

  const token = jwt.sign({}, process.env.JWT_SECRET_KEY, {
    expiresIn: "10d",
    subject: enterprise._id.toString(),
  });

  const refreshToken = jwt.sign({}, process.env.JWT_REFRESH_SECRET_KEY, {
    expiresIn: "30d",
    subject: enterprise._id.toString(),
  });

  let objEnterprise = enterprise.toObject();

  delete objEnterprise.password;

  return {
    enterprise: objEnterprise,
    token,
    refreshToken,
  };
}
