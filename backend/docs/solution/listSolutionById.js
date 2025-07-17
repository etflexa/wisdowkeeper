export const listSolutionByIdDoc = {
  "/api/solutions/{solutionId}/auth/{id}/enterprises/{enterpriseId}": {
    get: {
      tags: ["Soluções"],
      summary: "Obtém detalhes de uma solução específica",
      description:
        "Retorna informações completas de uma solução específica de uma empresa. Acesso permitido para usuários autenticados (empresas ou funcionários)",
      security: [
        {
          BearerAuth: [],
        },
      ],
      parameters: [
        {
          name: "solutionId",
          in: "path",
          description: "ID da solução",
          required: true,
          schema: {
            type: "string",
            example: "686886d978db3671aad16c8e",
          },
        },
        {
          name: "id",
          in: "path",
          description: "ID do ente autenticado",
          required: true,
          schema: {
            type: "string",
            example: "6866be415ea628e3dcbf74a3",
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
      ],
      responses: {
        200: {
          description: "Detalhes da solução retornados com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  solution: {
                    type: "object",
                    properties: {
                      _id: {
                        type: "string",
                        example: "686886d978db3671aad16c8e",
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
                        example: "Como criar interfaces com Typescript",
                      },
                      category: { type: "string", example: "Typescript" },
                      description: {
                        type: "string",
                        example: "Não use interfaces, uses type",
                      },
                      videoURL: {
                        type: "string",
                        example: "https://www.youtube.com/watch?v=87gWRVGRZ5o",
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
                              nullable: true,
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
                        example: "2025-07-05T01:58:49.395Z",
                      },
                      updatedAt: {
                        type: "string",
                        format: "date-time",
                        example: "2025-07-05T01:58:49.395Z",
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
                        example: "solução não encontrada",
                      },
                    },
                  },
                  {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example:
                          "solução não encontrado na lista de soluções da empresa",
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
                    example: "erro ao buscar solução",
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
