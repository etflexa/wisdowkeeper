import { AppError } from "../../middleware/appError.js";
import { Enterprise } from "../../models/enterprise.js";
import { Solution } from "../../models/solution.js";

export async function listSolutionById(data) {
  const { enterpriseId, solutionId } = data;

  const existingEnterprise = await Enterprise.findById(enterpriseId).lean();

  if (!existingEnterprise) {
    throw new AppError("empresa não encontrada", 404);
  }

  const solution = await Solution.findById(solutionId).lean();

  if (!solution) {
    throw new AppError("solução não encontrada", 404);
  }

  if (!solution.enterpriseId.equals(enterpriseId)) {
    throw new AppError(
      "solução não encontrado na lista de soluções da empresa",
      404
    );
  }

  return { solution };
}
