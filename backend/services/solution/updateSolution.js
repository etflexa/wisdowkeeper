import { AppError } from "../../middleware/appError.js";
import { Enterprise } from "../../models/enterprise.js";
import { Solution } from "../../models/solution.js";
import { User } from "../../models/user.js";

export async function updateSolution(data) {
  const { enterpriseId, userId, solutionId } = data;

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

  const solution = await Solution.findById(solutionId).lean();

  if (!solution) {
    throw new AppError("solução não encontrada", 404);
  }

  if (!solution.userId.equals(userId)) {
    throw new AppError(
      "solução não encontrado na lista de soluções do usuário",
      404
    );
  }

  delete data.enterpriseId;
  delete data.solutionId;
  delete data.userId;

  const updateSolution = await Solution.findByIdAndUpdate(solutionId, data, {
    new: true,
  });

  if (!updateSolution) {
    throw new AppError("erro ao atualizar solução", 500);
  }

  return { solution: updateSolution };
}
