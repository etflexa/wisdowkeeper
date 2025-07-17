export const listSolutionsEnterpriseDoc = {
  "/api/solutions/auth/{id}/enterprises/{enterpriseId}": {
    get: {
      tags: ["Soluções"],
      summary: "Lista todas as soluções de uma empresa",
      description:
        "Retorna soluções paginadas de uma empresa específica. Acesso permitido para usuários autenticados (empresas ou funcionários)",
      security: [
        {
          BearerAuth: [],
        },
      ],
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID do ente autenticado",
          required: true,
          schema: {
            type: "string",
            example: "686836bf76f741e2089d662b",
          },
        },
        {
          name: "enterpriseId",
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
          description: "Lista de soluções retornada com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  solutions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        _id: {
                          type: "string",
                          example: "686885a792d75c57a98c0a91",
                        },
                        enterpriseId: {
                          type: "string",
                          example: "6866be415ea628e3dcbf74a3",
                        },
                        userId: {
                          type: "string",
                          example: "686836bf76f741e2089d662b",
                        },
                        title: {
                          type: "string",
                          example: "Como criar uma Promise",
                        },
                        category: { type: "string", example: "Javascript" },
                        description: {
                          type: "string",
                          example: "Uma promise existe pra dar dor de cabeça",
                        },
                        videoURL: {
                          type: "string",
                          example:
                            "https://www.youtube.com/watch?v=87gWRVGRZ5o",
                          nullable: true,
                        },
                        files: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              name: {
                                type: "string",
                                example: "Typescript LOGO",
                              },
                              url: {
                                type: "string",
                                example: "https://example.com/logo.png",
                              },
                              extention: {
                                type: "string",
                                example: "png",
                                nullable: true, // Nem sempre presente nos exemplos
                              },
                              _id: {
                                type: "string",
                                example: "686886d978db3671aad16c8f",
                              },
                            },
                          },
                        },
                        createdAt: {
                          type: "string",
                          format: "date-time",
                          example: "2025-07-05T01:53:43.579Z",
                        },
                        updatedAt: {
                          type: "string",
                          format: "date-time",
                          example: "2025-07-05T01:53:43.579Z",
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
                        example: 3,
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
                    example: "erro ao buscar soluções",
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
