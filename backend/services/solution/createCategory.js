import { AppError } from "../../middleware/appError.js";
import { Enterprise } from "../../models/enterprise.js";
import { SolutionCategory } from "../../models/solution.js";

export async function createCategory(data) {
  const { enterpriseId, name } = data;

  const existingEnterprise = await Enterprise.findById(enterpriseId).lean();

  if (!existingEnterprise) {
    throw new AppError("empresa não encontrada", 404);
  }

  const existingCategory = await SolutionCategory.findOne({ name: name });

  if (existingCategory) {
    throw new AppError("categoria existente", 400);
  }

  const newSolutionCategpry = await SolutionCategory.create({
    enterpriseId,
    name,
  });

  if (!newSolutionCategpry) {
    throw new AppError("houve um problema ao criar a categoria", 500);
  }

  return { message: "categoria criada com sucesso" };
}
