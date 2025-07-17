export const sendAccessCredentialsToUserDoc = {
  "/api/enterprises/{id}/users/credentials": {
    post: {
      tags: ["Empresas"],
      summary: "Envia credenciais de acesso para um usuário",
      description:
        "Envia as credenciais de acesso (e-mail e senha) para um usuário específico associado à empresa",
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
                  example: "6867e377a3bcc4c40aac1f90",
                  description: "ID do usuário que receberá as credenciais",
                },
              },
              required: ["userId"],
              additionalProperties: false,
            },
          },
        },
      },
      responses: {
        201: {
          description: "Credenciais enviadas com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example:
                      "credenciais de acesso enviadas com sucesso para o e-mail do(a) usuário(a)",
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
          description: "Erro interno no envio de credenciais",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "erro ao enviar credenciais",
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
