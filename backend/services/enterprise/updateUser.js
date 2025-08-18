import { AppError } from "../../middleware/appError.js";
import { User } from "../../models/user.js";

export async function updateUser(data) {
  const { enterpriseId, userId, type, name, lastName, isActive} = data;

  const existingUser = await User.findById(userId);

  if (!existingUser) {
    throw new AppError("usuário não encontrado(a)", 404);
  }

  if (!existingUser.enterpriseId.equals(enterpriseId)) {
    throw new AppError(
      "usuário(a) não encontrado na lista de cadastros da empresa",
      404
    );
  }

  const objUpdateUser = {
    type,
    name,
    lastName,
    isActive
  };

  await User.findByIdAndUpdate(userId, objUpdateUser);

  return { message: "usuário(a) atualizado(a) com sucesso" };
}
