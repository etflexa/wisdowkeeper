import { AppError } from "../../middleware/appError.js";
import { Enterprise } from "../../models/enterprise.js";

export async function softDeleteEnterprise(enterpriseId) {
  const enterprise = await Enterprise.findById(enterpriseId);

  if (!enterprise) {
    throw new AppError("empresa não encontrada", 404);
  }

  if (!enterprise.isActive) {
    throw new AppError("empresa se encontra inativada", 400);
  }

  enterprise.isActive = false;

  const inativeEnterprise = await enterprise.save();

  if (inativeEnterprise.isActive) {
    throw new AppError("houve um problema ao remover a empresa", 500);
  }

  return;
}
