import { AppError } from "../../middleware/appError.js";
import { Enterprise } from "../../models/enterprise.js";
import { User } from "../../models/user.js";
import { sendEmail } from "../../utils/senderEmail.js";

export async function sendAccessCredentialsToUser(data) {
  const { enterpriseId, userId } = data;

  const existingEnterprise = await Enterprise.findById(enterpriseId).lean();

  if (!existingEnterprise) {
    throw new AppError("empresa não encontrada", 404);
  }

  const existingUser = await User.findById(userId)
    .select("+passwordDecode")
    .lean();

  if (!existingUser) {
    throw new AppError("usuário(a) não encontrado(a)", 404);
  }

  if (!existingUser.enterpriseId.equals(enterpriseId)) {
    throw new AppError(
      "usuário(a) não encontrado na lista de cadastros da empresa",
      404
    );
  }

  await sendEmail({
    receiver: existingUser.email,
    password: existingUser.passwordDecode,
  });

  return {
    message:
      "credenciais de acesso enviadas com sucesso para o e-mail do(a) usuário(a)",
  };
}
