export const listCategoriesDoc = {
  "/api/solutions/categories/enterprises/{id}": {
    get: {
      tags: ["Soluções"],
      summary: "Lista todas as categorias de soluções de uma empresa",
      description: "Retorna as categorias de soluções cadastradas pela empresa",
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
          description: "Lista de categorias retornada com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  categories: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        _id: {
                          type: "string",
                          example: "686874d618a7463156982c8c",
                        },
                        name: {
                          type: "string",
                          example: "Javascript",
                        },
                        createdAt: {
                          type: "string",
                          format: "date-time",
                          example: "2025-07-05T00:41:58.785Z",
                        },
                        updatedAt: {
                          type: "string",
                          format: "date-time",
                          example: "2025-07-05T00:41:58.785Z",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Empresa sem categorias cadastradas",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "empresa ainda não têm categorias cadastradas",
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
                    example: "erro ao buscar categorias",
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
