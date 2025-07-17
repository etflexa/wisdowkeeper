import { AppError } from "../../middleware/appError.js";
import { Enterprise } from "../../models/enterprise.js";
import { Solution } from "../../models/solution.js";
import { User } from "../../models/user.js";

export async function createSolution(data) {
  const { enterpriseId, userId, title, category, description } = data;

  if (!enterpriseId || !userId || !title || !category || !description) {
    throw new AppError("campos obrigatórios estão faltando", 400);
  }

  const existingEnterprise = await Enterprise.findById(enterpriseId).lean();

  if (!existingEnterprise) {
    throw new AppError("empresa não encontrada", 404);
  }

  const existingUser = await User.findById(userId).lean();

  if (!existingUser) {
    throw new AppError("usuário(a) não encontrado(a)", 404);
  }

  if (!existingUser.enterpriseId.equals(enterpriseId)) {
    throw new AppError(
      "usuário(a) não encontrado na lista de cadastros da empresa",
      404
    );
  }

  const newSolution = await Solution.create(data);

  if (!newSolution) {
    throw new AppError("houve um problema ao criar a solução", 500);
  }

  return { solution: newSolution };
}
