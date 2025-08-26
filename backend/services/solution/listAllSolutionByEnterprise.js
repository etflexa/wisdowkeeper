import { AppError } from "../../middleware/appError.js";
import { Enterprise } from "../../models/enterprise.js";
import { Solution } from "../../models/solution.js";

export async function listAllSolutionByEnterprise(data) {
  const { enterpriseId, page = 1 } = data;

  const limit = 10;

  const skip = (page - 1) * limit;

  const existingEnterprise = await Enterprise.findById(enterpriseId).lean();

  if (!existingEnterprise) {
    throw new AppError("empresa não encontrada", 404);
  }

  const [solutions, total] = await Promise.all([
    Solution.find({ enterpriseId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Solution.countDocuments({ enterpriseId })
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    solutions,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total
    }
  };
}