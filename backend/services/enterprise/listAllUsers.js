import { AppError } from "../../middleware/appError.js";
import { Enterprise } from "../../models/enterprise.js";
import { User } from "../../models/user.js";

export async function listAllUsers(data) {
  const { enterpriseId, page = 1 } = data;

  const limit = 10;

  const skip = (page - 1) * limit;

  const existingEnterprise = await Enterprise.findById(enterpriseId).lean();

  if (!existingEnterprise) {
    throw new AppError("empresa não encontrada", 404);
  }

  const [users, total] = await Promise.all([
    User.find({ enterpriseId }).skip(skip).limit(limit).lean(),
    User.countDocuments({ enterpriseId }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    users,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
    },
  };
}
