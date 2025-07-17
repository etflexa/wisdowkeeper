export const updateSolutionDoc = {
  "/api/solutions/users/{id}": {
    patch: {
      tags: ["Soluções"],
      summary: "Atualiza uma solução existente",
      description:
        "Permite que o usuário autenticado atualize uma solução que ele criou. Apenas o criador original pode atualizar a solução.",
      security: [
        {
          BearerAuth: [],
        },
      ],
      parameters: [
        {
          name: "id",
          in: "path",
          description:
            "ID do usuário autenticado (deve ser o criador da solução)",
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
                  description: "ID da empresa associada (obrigatório)",
                },
                solutionId: {
                  type: "string",
                  example: "686886d978db3671aad16c8e",
                  description: "ID da solução a ser atualizada (obrigatório)",
                },
                title: {
                  type: "string",
                  example: "Como criar interfaces com Typescript 2",
                  description: "Novo título (opcional)",
                  nullable: true,
                },
                category: {
                  type: "string",
                  example: "Typescript",
                  description: "Nova categoria (opcional)",
                  nullable: true,
                },
                description: {
                  type: "string",
                  example: "Não use interfaces, uses type",
                  description: "Nova descrição (opcional)",
                  nullable: true,
                },
                videoURL: {
                  type: "string",
                  example: "https://www.youtube.com/watch?v=87gWRVGRZ5o",
                  description: "Novo URL de vídeo (opcional)",
                  nullable: true,
                },
                files: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string", example: "Typescript LOGO" },
                      url: {
                        type: "string",
                        example: "https://example.com/logo.png",
                      },
                      extention: {
                        type: "string",
                        example: "png",
                        nullable: true,
                      },
                    },
                  },
                  description: "Nova lista de arquivos (opcional)",
                  nullable: true,
                },
              },
              required: ["enterpriseId", "solutionId"],
              additionalProperties: false,
            },
          },
        },
      },
      responses: {
        201: {
          description: "Solução atualizada com sucesso",
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
                        example: "Como criar interfaces com Typescript 2",
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
                        example: "2025-07-05T13:16:28.362Z",
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
                          "solução não encontrado na lista de soluções do usuário",
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        500: {
          description: "Erro ao atualizar solução",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "erro ao atualizar solução",
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
