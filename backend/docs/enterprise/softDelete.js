export const softDeleteEnterpriseDoc = {
  "/api/enterprises/{id}": {
    delete: {
      tags: ["Empresas"],
      summary: "Desativa uma empresa",
      description:
        "Realiza um soft delete (desativação) da empresa, marcando-a como inativa ao invés de excluir permanentemente.",
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
        204: {
          description: "Empresa desativada com sucesso (NO CONTENT)",
        },
        400: {
          description: "Empresa já está desativada",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "empresa se encontra inativada",
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
          description: "Erro ao desativar a empresa",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "houve um problema ao remover a empresa",
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
