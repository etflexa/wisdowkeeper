import sgMail from "@sendgrid/mail";
import "dotenv/config";
import { AppError } from "../middleware/appError.js";

sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

function templateHtml({ email, senha }) {
  return `
        <body style="font-family: Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
            <h1 style="color: #2d7ff9; text-align: center;">Bem-vindo(a)!</h1>
            <p style="font-size: 16px; color: #333333; line-height: 1.5;">
              Seu perfil foi criado com sucesso no <strong>WisdowKeeper</strong>.
            </p>
            <p style="font-size: 16px; color: #333333; line-height: 1.5;">
              Seus dados de login são:
            </p>
            <div style="background-color: #f1f5ff; padding: 15px; border-radius: 5px; font-family: monospace; margin-top: 10px;">
              Email: ${email}<br />
              Senha: ${senha}
            </div>
            <div style="text-align: center; font-size: 12px; color: #888888; margin-top: 30px;">
              Este é um e-mail automático. Por favor, não responda.
            </div>
          </div>
        </body>
    `;
}

export async function sendEmail(data) {
  const { receiver, password } = data;

  const msg = {
    to: receiver,
    from: "elizeucosta21@gmail.com",
    subject: "Perfil criado com sucesso no WisdowKeeper",
    html: templateHtml({
      email: receiver,
      senha: password,
    }),
  };

  try {
    await sgMail.send(msg);
    console.log("e-mail enviado com sucesso");
  } catch (error) {
    throw new AppError("erro ao enviar credenciais ao usuário(a)", 500);
  }
}
