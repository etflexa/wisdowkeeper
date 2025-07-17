export const createEnterpriseDoc = {
  "/api/enterprises": {
    post: {
      tags: ["Empresas"],
      summary: "Cria uma nova empresa",
      description: "Registra uma nova empresa no sistema com dados básicos.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  example: "Inferninho Bar e Desenvolvimento",
                  description: "Nome completo da empresa",
                },
                cnpj: {
                  type: "string",
                  example: "95.387.969/0001-73",
                  description: "CNPJ da empresa",
                },
                email: {
                  type: "string",
                  format: "email",
                  example: "inferninho@mail.com",
                  description: "E-mail da empresa",
                },
                password: {
                  type: "string",
                  minLength: 6,
                  example: "senhaSegura123",
                  description: "Senha com no mínimo 6 caracteres",
                },
              },
              required: ["name", "cnpj", "email", "password"],
              additionalProperties: false,
            },
          },
        },
      },
      responses: {
        201: {
          description: "Empresa cadastrada com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Cadastro realizado com sucesso",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Erro de validação ou empresa já cadastrada",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "empresa se encontra cadastrada",
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Erro interno no servidor",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "erro ao criar empresa",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
