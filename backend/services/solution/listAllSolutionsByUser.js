import { AppError } from "../../middleware/appError.js";
import { Enterprise } from "../../models/enterprise.js";
import { Solution } from "../../models/solution.js";
import { User } from "../../models/user.js";

export async function listAllSolutionByUser(data) {
  const { enterpriseId, userId, page = 1 } = data;

  const limit = 10;

  const skip = (page - 1) * limit;

  const existingEnterprise = await Enterprise.findById(enterpriseId).lean();

  if (!existingEnterprise) {
    throw new AppError("empresa não encontrada", 404);
  }

  const existingUser = await User.findById(userId).lean();

  if (!existingUser) {
    throw new AppError("usuário(a) não encontrado(a)", 404);
  }

  const [solutions, total] = await Promise.all([
    Solution.find({ userId }).skip(skip).limit(limit).lean(),
    Solution.countDocuments({ userId }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    solutions,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
    },
  };
}
