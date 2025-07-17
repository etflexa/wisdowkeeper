import { AppError } from "../../middleware/appError.js";
import { Enterprise } from "../../models/enterprise.js";
import { SolutionCategory } from "../../models/solution.js";

export async function listCategories(data) {
  const { enterpriseId } = data;

  const existingEnterprise = await Enterprise.findById(enterpriseId).lean();

  if (!existingEnterprise) {
    throw new AppError("empresa não encontrada", 404);
  }

  const categories = await SolutionCategory.find({ enterpriseId })
    .select("-enterpriseId")
    .lean();

  if (!categories) {
    throw new AppError("empresa ainda não têm categorias cadastradas", 400);
  }

  return { categories };
}
