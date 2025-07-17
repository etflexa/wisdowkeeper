export const createSolutionDoc = {
  "/api/solutions/users/{id}": {
    post: {
      tags: ["Soluções"],
      summary: "Cria uma nova solução",
      description:
        "Permite que um usuário autenticado crie uma nova solução associada à empresa",
      security: [
        {
          BearerAuth: [],
        },
      ],
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID do usuário autenticado",
          required: true,
          schema: {
            type: "string",
            example: "686836bf76f741e2089d662b",
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
                enterpriseId: {
                  type: "string",
                  example: "6866be415ea628e3dcbf74a3",
                  description: "ID da empresa associada",
                },
                title: {
                  type: "string",
                  example: "Como criar interfaces com Typescript",
                  description: "Título da solução",
                },
                category: {
                  type: "string",
                  example: "Typescript",
                  description: "Categoria da solução",
                },
                description: {
                  type: "string",
                  example: "Não use interfaces, uses type",
                  description: "Descrição detalhada da solução",
                },
                videoURL: {
                  type: "string",
                  example: "https://www.youtube.com/watch?v=87gWRVGRZ5o",
                  description: "URL de vídeo opcional",
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
                        example:
                          "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/1024px-Typescript_logo_2020.svg.png",
                      },
                      extention: {
                        type: "string",
                        example: "png",
                      },
                    },
                    required: ["name", "url", "extention"],
                  },
                  example: [
                    {
                      name: "Typescript LOGO",
                      url: "https://example.com/logo.png",
                      extention: "png",
                    },
                    {
                      name: "Documentação PDF",
                      url: "https://example.com/doc.pdf",
                      extention: "pdf",
                    },
                  ],
                  description: "Lista de arquivos relacionados (opcional)",
                  nullable: true,
                },
              },
              required: ["enterpriseId", "title", "category", "description"],
              additionalProperties: false,
            },
          },
        },
      },
      responses: {
        201: {
          description: "Solução criada com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  solution: {
                    type: "object",
                    properties: {
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
                            name: { type: "string" },
                            url: { type: "string" },
                            extention: { type: "string" },
                            _id: { type: "string" },
                          },
                        },
                        example: [
                          {
                            name: "Typescript LOGO",
                            url: "https://example.com/logo.png",
                            extention: "png",
                            _id: "6868875678db3671aad16c95",
                          },
                        ],
                      },
                      _id: {
                        type: "string",
                        example: "6868875678db3671aad16c94",
                      },
                      createdAt: {
                        type: "string",
                        format: "date-time",
                        example: "2025-07-05T02:00:54.229Z",
                      },
                      updatedAt: {
                        type: "string",
                        format: "date-time",
                        example: "2025-07-05T02:00:54.229Z",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Campos obrigatórios faltando",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "campos obrigatórios estão faltando",
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
          description: "Erro ao criar solução",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "houve um problema ao criar a solução",
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
