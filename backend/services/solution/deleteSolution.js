import { AppError } from "../../middleware/appError.js";
import { Enterprise } from "../../models/enterprise.js";
import { Solution } from "../../models/solution.js";
import { User } from "../../models/user.js";

const handleDelete = async solutionId => {
  await Solution.findByIdAndDelete(solutionId);
};

export async function deleteSolution(data) {
  const { enterpriseId, userId, authId, solutionId } = data;

  const solution = await Solution.findById(solutionId).lean();

  if (!solution) {
    throw new AppError("solução não encontrada", 404);
  }

  const existingEnterprise = await Enterprise.findById(enterpriseId).lean();

  if (!existingEnterprise) {
    throw new AppError("empresa não encontrada", 404);
  }

  if (existingEnterprise._id.equals(authId)) {
    handleDelete(solutionId);
    return;
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

  if (!solution.userId.equals(userId)) {
    throw new AppError(
      "solução não encontrado na lista de soluções do usuário",
      404
    );
  }

  handleDelete(solutionId);
  return;
}
