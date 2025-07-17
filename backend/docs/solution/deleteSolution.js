export const deleteSolutionDoc = {
  "/api/solutions/{solutionId}/auth/{id}/enterprises/{enterpriseId}/users/{userId}":
    {
      delete: {
        tags: ["Soluções"],
        summary: "Exclui uma solução",
        description:
          "Permite que empresas excluam qualquer solução de sua empresa, ou que usuários excluam apenas suas próprias soluções",
        security: [
          {
            BearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "solutionId",
            in: "path",
            description: "ID da solução a ser excluída",
            required: true,
            schema: {
              type: "string",
              example: "686886d978db3671aad16c8e",
            },
          },
          {
            name: "id",
            in: "path",
            description: "ID do autenticado (empresa ou usuário)",
            required: true,
            schema: {
              type: "string",
              example: "6866be415ea628e3dcbf74a3",
            },
          },
          {
            name: "enterpriseId",
            in: "path",
            description: "ID da empresa associada",
            required: true,
            schema: {
              type: "string",
              example: "6866be415ea628e3dcbf74a3",
            },
          },
          {
            name: "userId",
            in: "path",
            description: "ID do usuário criador da solução",
            required: true,
            schema: {
              type: "string",
              example: "686836bf76f741e2089d662b",
            },
          },
        ],
        responses: {
          204: {
            description: "Solução excluída com sucesso (sem conteúdo)",
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
                          example: "solução não encontrada",
                        },
                      },
                    },
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
            description: "Erro ao excluir solução",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "erro ao excluir solução",
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
