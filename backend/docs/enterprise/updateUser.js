export const updateUserEnterpriseDoc = {
  "/api/enterprises/{id}/users": {
    patch: {
      tags: ["Empresas"],
      summary: "Atualiza informações de um usuário",
      description:
        "Permite que uma empresa atualize dados de um usuário associado",
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
                  description: "ID do usuário a ser atualizado",
                },
                type: {
                  type: "string",
                  example: "QA",
                  description: "Novo cargo/função do usuário",
                },
                name: {
                  type: "string",
                  example: "Samuel",
                  description: "Novo primeiro nome",
                },
                lastName: {
                  type: "string",
                  example: "Tchola",
                  description: "Novo sobrenome",
                },
              },
              required: ["userId", "type", "name", "lastName"],
              additionalProperties: false,
            },
          },
        },
      },
      responses: {
        201: {
          description: "Usuário atualizado com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "usuário(a) atualizado(a) com sucesso",
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
                        example: "usuário não encontrado(a)",
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
                    example: "erro ao atualizar usuário(a)",
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
