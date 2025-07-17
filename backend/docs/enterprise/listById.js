export const listEnterpriseByIdDoc = {
  "/api/enterprises/{id}": {
    get: {
      tags: ["Empresas"],
      summary: "Obtém informações de uma empresa específica",
      description:
        "Retorna todos os detalhes de uma empresa com base no seu ID",
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
      responses: {
        200: {
          description: "Informações da empresa retornadas com sucesso",
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
                      email: {
                        type: "string",
                        format: "email",
                        example: "contato@empresa.com",
                      },
                      cnpj: {
                        type: "string",
                        example: "12345678000199",
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
                    example: "Erro ao buscar empresa",
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
