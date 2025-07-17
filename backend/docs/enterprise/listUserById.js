export const listUserByIdDoc = {
  "/api/enterprises/{id}/users/{userId}": {
    get: {
      tags: ["Empresas"],
      summary: "Obtém detalhes de um usuário específico",
      description:
        "Retorna informações completas de um usuário associado à empresa",
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
        {
          name: "userId",
          in: "path",
          description: "ID do usuário",
          required: true,
          schema: {
            type: "string",
            example: "686807c9bb353810f2a4f289",
          },
        },
      ],
      responses: {
        200: {
          description: "Detalhes do usuário retornados com sucesso",
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
                        example: "686807c9bb353810f2a4f289",
                      },
                      type: {
                        type: "string",
                        example: "QA",
                      },
                      name: {
                        type: "string",
                        example: "Samuel",
                      },
                      lastName: {
                        type: "string",
                        example: "Tchola",
                      },
                      cpf: {
                        type: "string",
                        example: "123.456.789-15",
                      },
                      email: {
                        type: "string",
                        format: "email",
                        example: "samuk@mail.com",
                      },
                      enterpriseId: {
                        type: "string",
                        example: "6866be415ea628e3dcbf74a3",
                      },
                      isActive: {
                        type: "boolean",
                        example: true,
                      },
                      createdAt: {
                        type: "string",
                        format: "date-time",
                        example: "2025-07-04T16:56:41.747Z",
                      },
                      updatedAt: {
                        type: "string",
                        format: "date-time",
                        example: "2025-07-04T18:17:08.549Z",
                      },
                    },
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
        404: {
          description: "Recurso não encontrado",
          content: {
            "application/json": {
              schema: {
                oneOf: [
                  {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "empresa não encontrada",
                      },
                    },
                  },
                  {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "usuário(a) não encontrado(a)",
                      },
                    },
                  },
                  {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example:
                          "usuário(a) não encontrado na lista de cadastros da empresa",
                      },
                    },
                  },
                ],
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
                    example: "erro ao buscar usuário",
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
