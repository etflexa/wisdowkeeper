import { User } from "../../models/user.js";
import { AppError } from "../../middleware/appError.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";

function generatePassword() {
  return crypto
    .randomBytes(3)
    .toString("hex")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export async function createUserEnterprise(data) {
  const { type, name, lastName, email, cpf, enterpriseId } = data;

  const existingUser = await User.findOne({ $or: [{ email }, { cpf }] });

  if (existingUser && existingUser.enterpriseId.equals(enterpriseId)) {
    throw new AppError("usuário se encontra cadastrado na empresa", 400);
  }

  const newPassword = generatePassword();

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const objUser = {
    type,
    name,
    lastName,
    email,
    cpf,
    enterpriseId,
    password: hashedPassword,
    passwordDecode: newPassword,
  };

  const newUser = await User.create(objUser);

  if (!newUser) {
    throw new AppError("erro ao usuário", 500);
  }

  let parseObjUser = newUser.toObject();

  delete parseObjUser.password;
  delete parseObjUser.passwordDecode;

  return { user: parseObjUser };
}
