export const loginEnterpriseDoc = {
  "/api/enterprises/login": {
    post: {
      tags: ["Empresas"],
      summary: "Autentica uma empresa",
      description:
        "Realiza o login de uma empresa com e-mail e senha, retornando tokens de acesso.",
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
                  example: "inferninho@mail.com",
                },
                password: {
                  type: "string",
                  example: "senhaSegura123",
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
                  enterprise: {
                    type: "object",
                    properties: {
                      _id: {
                        type: "string",
                        example: "6866be415ea628e3dcbf74a3",
                      },
                      name: {
                        type: "string",
                        example: "Inferninho Bar e Desenvolvimento",
                      },
                      users: {
                        type: "array",
                        items: { type: "string" },
                        example: [],
                      },
                      solutions: {
                        type: "array",
                        items: { type: "string" },
                        example: [],
                      },
                      isActive: {
                        type: "boolean",
                        example: true,
                      },
                      createdAt: {
                        type: "string",
                        format: "date-time",
                        example: "2025-07-03T17:30:41.084Z",
                      },
                      updatedAt: {
                        type: "string",
                        format: "date-time",
                        example: "2025-07-03T17:30:41.084Z",
                      },
                    },
                  },
                  token: {
                    type: "string",
                    example:
                      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTE1NjU2MzgsImV4cCI6MTc1MjQyOTYzOCwic3ViIjoiNjg2NmJlNDE1ZWE2MjhlM2RjYmY3NGEzIn0.MPTwera1NORPnHX4o4S3Py9YUV9votmgXEQfgcvCKR0",
                  },
                  refreshToken: {
                    type: "string",
                    example:
                      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTE1NjU2MzgsImV4cCI6MTc1NDE1NzYzOCwic3ViIjoiNjg2NmJlNDE1ZWE2MjhlM2RjYmY3NGEzIn0.2Slm10if16K7e-1OfvllLP-QaKt8uxA8cCGWMgAzrWs",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "credenciais inválidas",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "credenciais inválidas",
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
                    example: "Erro ao autenticar empresa",
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
