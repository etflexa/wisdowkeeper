export const createUserEnterpriseDoc = {
  "/api/enterprises/{id}/users": {
    post: {
      tags: ["Empresas"],
      summary: "Cria um novo usuário associado à empresa",
      description:
        "Cria um usuário com senha gerada automaticamente e associa à empresa autenticada",
      security: [
        {
          BearerAuth: [],
        },
      ],
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID da empresa",
          required: true,
          schema: {
            type: "string",
            example: "6866be415ea628e3dcbf74a3",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  example: "Programador",
                  description: "Cargo/função do usuário",
                },
                name: {
                  type: "string",
                  example: "Jaime",
                  description: "Primeiro nome do usuário",
                },
                lastName: {
                  type: "string",
                  example: "Devops",
                  description: "Sobrenome do usuário",
                },
                email: {
                  type: "string",
                  format: "email",
                  example: "jaimedev@mail.com",
                  description: "E-mail do usuário",
                },
                cpf: {
                  type: "string",
                  example: "123.456.789-14",
                  description: "CPF do usuário (formato livre)",
                },
              },
              required: ["type", "name", "lastName", "email", "cpf"],
              additionalProperties: false,
            },
          },
        },
      },
      responses: {
        201: {
          description: "Usuário criado com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  user: {
                    type: "object",
                    properties: {
                      type: { type: "string", example: "Programador" },
                      name: { type: "string", example: "Jaime" },
                      lastName: { type: "string", example: "Devops" },
                      cpf: { type: "string", example: "123.456.789-14" },
                      email: {
                        type: "string",
                        example: "jaimedev@mail.com",
                      },
                      enterpriseId: {
                        type: "string",
                        example: "6866be415ea628e3dcbf74a3",
                        description: "ID da empresa associada",
                      },
                      isActive: { type: "boolean", example: true },
                      _id: {
                        type: "string",
                        example: "6867e377a3bcc4c40aac1f90",
                      },
                      createdAt: {
                        type: "string",
                        format: "date-time",
                        example: "2025-07-04T14:21:43.295Z",
                      },
                      updatedAt: {
                        type: "string",
                        format: "date-time",
                        example: "2025-07-04T14:21:43.295Z",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Usuário já cadastrado na empresa",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "usuário se encontra cadastrado na empresa",
                  },
                },
              },
            },
          },
        },
        401: {
          description: "Não autorizado",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "sem permissão para acessar o recurso",
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Erro ao criar usuário",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "erro ao criar usuário",
                  },
                },
              },
            },
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
  },
};
