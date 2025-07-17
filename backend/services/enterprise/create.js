import bcrypt from "bcryptjs";
import { Enterprise } from "../../models/enterprise.js";
import { AppError } from "../../middleware/appError.js";

export async function createEnterprise(data) {
  const { name, cnpj, email, password } = data;

  const existingEnterprise = await Enterprise.findOne({
    $or: [{ email }, { cnpj }]
  });

  if (existingEnterprise) {
    throw new AppError("empresa se encontra cadastrada", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const infoEnterprise = {
    name,
    email,
    password: hashedPassword,
    cnpj
  };

  const newEnterprise = await Enterprise.create(infoEnterprise);

  if (!newEnterprise) {
    throw new AppError("erro ao criar empresa", 500);
  }

  return { message: "cadastro realizado com sucesso" };
}
