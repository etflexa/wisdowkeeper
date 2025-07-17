export const deleteFileDoc = {
  "/api/solutions/auth/{id}/file-url": {
    delete: {
      tags: ["Arquivos"],
      summary: "Exclui um arquivo do bucket de armazenamento",
      description:
        "Remove um arquivo específico do bucket R2 usando sua URL pública",
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
                fileURL: {
                  type: "string",
                  example:
                    "https://pub-f909a197a9fc4616b32ef8a024590295.r2.dev/uploads/0a5073ee-c300-4e10-90e1-1ac3af7664a5-livro-programacao.pdf",
                  description: "URL pública completa do arquivo a ser excluído",
                },
              },
              required: ["fileURL"],
              additionalProperties: false,
            },
          },
        },
      },
      responses: {
        204: {
          description: "Arquivo excluído com sucesso (sem conteúdo)",
        },
        400: {
          description: "URL inválida ou faltando",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "fileURL é obrigatório",
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
        500: {
          description: "Erro ao excluir arquivo",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Erro ao deletar o arquivo do bucket",
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
