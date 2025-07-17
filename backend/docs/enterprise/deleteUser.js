export const deleteUserEnterpriseDoc = {
  "/api/enterprises/{id}/users": {
    delete: {
      tags: ["Empresas"],
      summary: "Desativa ou exclui permanentemente um usuário",
      description:
        "Permite que uma empresa desative (soft delete) ou exclua permanentemente (hard delete) um usuário associado",
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
                userId: {
                  type: "string",
                  example: "686807c9bb353810f2a4f289",
                  description: "ID do usuário a ser desativado/excluído",
                },
                isDelete: {
                  type: "boolean",
                  example: false,
                  description:
                    "True para exclusão permanente, False para desativação",
                },
              },
              required: ["userId", "isDelete"],
              additionalProperties: false,
            },
          },
        },
      },
      responses: {
        204: {
          description: "Operação realizada com sucesso (sem conteúdo)",
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
                    example: "erro ao processar a solicitação",
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
