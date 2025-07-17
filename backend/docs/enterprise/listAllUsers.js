export const listAllUsersEnterpriseDoc = {
  "/api/enterprises/{id}/users": {
    get: {
      tags: ["Empresas"],
      summary: "Lista todos os usuários cadastrados em uma empresa",
      description:
        "Retorna uma lista paginada de usuários associados à empresa",
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
          name: "page",
          in: "query",
          description: "Número da página",
          required: false,
          schema: {
            type: "integer",
            minimum: 1,
            default: 1,
            example: 1,
          },
        },
      ],
      responses: {
        200: {
          description: "Lista de usuários retornada com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  users: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        _id: {
                          type: "string",
                          example: "6867e377a3bcc4c40aac1f90",
                        },
                        type: {
                          type: "string",
                          example: "Programador",
                        },
                        name: {
                          type: "string",
                          example: "Jaime",
                        },
                        lastName: {
                          type: "string",
                          example: "Devops",
                        },
                        cpf: {
                          type: "string",
                          example: "123.456.789-14",
                        },
                        email: {
                          type: "string",
                          format: "email",
                          example: "jaimedev@mail.com",
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
                  pagination: {
                    type: "object",
                    properties: {
                      currentPage: {
                        type: "integer",
                        example: 1,
                      },
                      totalPages: {
                        type: "integer",
                        example: 1,
                      },
                      totalItems: {
                        type: "integer",
                        example: 7,
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
          description: "Empresa não encontrada",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "empresa não encontrada",
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
                    example: "Erro ao listar usuários",
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
