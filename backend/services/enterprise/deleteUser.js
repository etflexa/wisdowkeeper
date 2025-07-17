import { AppError } from "../../middleware/appError.js";
import { Enterprise } from "../../models/enterprise.js";
import { User } from "../../models/user.js";

export async function deleteUser(data) {
  const { enterpriseId, userId, isDelete } = data;

  const existingEnterprise = await Enterprise.findById(enterpriseId).lean();

  if (!existingEnterprise) {
    throw new AppError("empresa não encontrada", 404);
  }

  const existingUser = await User.findById(userId);

  if (!existingUser) {
    throw new AppError("usuário(a) não encontrado(a)", 404);
  }

  if (!existingUser.enterpriseId.equals(enterpriseId)) {
    throw new AppError(
      "usuário(a) não encontrado na lista de cadastros da empresa",
      404
    );
  }

  if (isDelete) {
    await User.deleteOne({ _id: userId });
    return;
  }

  existingUser.isActive = false;

  await existingUser.save();

  return;
}
