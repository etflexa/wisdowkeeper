export const createCategoryDoc = {
  "/api/solutions/categories/enterprises/{id}": {
    post: {
      tags: ["Soluções"],
      summary: "Cria uma nova categoria de solução",
      description:
        "Permite que uma empresa crie uma nova categoria para organizar soluções (apenas empresas autenticadas)",
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
                name: {
                  type: "string",
                  example: "Typescript",
                  description: "Nome único da categoria",
                },
              },
              required: ["name"],
              additionalProperties: false,
            },
          },
        },
      },
      responses: {
        201: {
          description: "Categoria criada com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "categoria criada com sucesso",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Categoria já existe",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "categoria existente",
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
          description: "Erro ao criar categoria",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "houve um problema ao criar a categoria",
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
