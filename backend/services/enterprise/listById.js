import { AppError } from "../../middleware/appError.js";
import { Enterprise } from "../../models/enterprise.js";

export async function listEnterpriseById(enterpriseId) {
  const enterprise = await Enterprise.findById(enterpriseId);

  if (!enterprise) {
    throw new AppError("empresa não encontrada", 404);
  }

  return { enterprise };
}
