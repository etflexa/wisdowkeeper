export const loginUserDoc = {
  "/api/users/login": {
    post: {
      tags: ["Usuários"],
      summary: "Autentica um usuário",
      description:
        "Realiza o login de um usuário com e-mail e senha, retornando tokens de acesso",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: {
                  type: "string",
                  format: "email",
                  example: "patricktchola@mail.com",
                },
                password: {
                  type: "string",
                  example: "bbed4e",
                },
              },
              required: ["email", "password"],
              additionalProperties: false,
            },
          },
        },
      },
      responses: {
        201: {
          description: "Autenticação bem-sucedida",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  user: {
                    type: "object",
                    properties: {
                      _id: {
                        type: "string",
                        example: "686836bf76f741e2089d662b",
                      },
                      type: { type: "string", example: "Design" },
                      name: { type: "string", example: "Patrick" },
                      lastName: { type: "string", example: "Tchola" },
                      cpf: { type: "string", example: "123.456.789-16" },
                      email: {
                        type: "string",
                        example: "patricktchola@mail.com",
                      },
                      enterpriseId: {
                        type: "string",
                        example: "6866be415ea628e3dcbf74a3",
                      },
                      isActive: { type: "boolean", example: true },
                      createdAt: {
                        type: "string",
                        format: "date-time",
                        example: "2025-07-04T20:17:03.669Z",
                      },
                      updatedAt: {
                        type: "string",
                        format: "date-time",
                        example: "2025-07-04T20:17:03.669Z",
                      },
                    },
                  },
                  token: {
                    type: "string",
                    example:
                      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTE2NjAzNTYsImV4cCI6MTc1MjUyNDM1Niwic3ViIjoiNjg2ODM2YmY3NmY3NDFlMjA4OWQ2NjJiIn0.kUVe3CXkKeystkB21-zkONsH0aO29zFZbsuhKXYbd_s",
                  },
                  refreshToken: {
                    type: "string",
                    example:
                      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTE2NjAzNTYsImV4cCI6MTc1NDI1MjM1Niwic3ViIjoiNjg2ODM2YmY3NmY3NDFlMjA4OWQ2NjJiIn0.Eotrj0M5lZkaZoIHBQWrCvpNu0tPxHZaEH3br8SUdFk",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Credenciais inválidas ou empresa inativa",
          content: {
            "application/json": {
              schema: {
                oneOf: [
                  {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "credenciais inválidas",
                      },
                    },
                  },
                  {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "Empresa com atividade suspensa",
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        401: {
          description: "Usuário inativo",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example:
                      "Usuário sem permissão para logar. Contate a empresa para regularizar seu cadastro",
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Erro interno do servidor",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "erro ao autenticar usuário",
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
