export const createUploadUrlDoc = {
  "/api/solutions/auth/{id}/file-url": {
    post: {
      tags: ["Arquivos"],
      summary: "Gera URL assinada para upload de arquivo",
      description:
        "Cria uma URL pré-assinada para upload direto de arquivos para o bucket de armazenamento",
      security: [
        {
          BearerAuth: [],
        },
      ],
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID do ente autenticado",
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
                fileName: {
                  type: "string",
                  example: "livro-programacao",
                  description:
                    "Nome do arquivo parseado (sem espaços em branco e sem extensão)",
                },
                contentType: {
                  type: "string",
                  example: "application/pdf",
                  description:
                    "Tipo MIME do arquivo (ex: image/png, application/pdf, video/mp4)",
                },
                extention: {
                  type: "string",
                  example: "pdf",
                  description:
                    "Extensão do arquivo sem ponto (ex: png, pdf, mp4)",
                },
              },
              required: ["fileName", "contentType", "extention"],
              additionalProperties: false,
            },
          },
        },
      },
      responses: {
        201: {
          description: "URLs geradas com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  uploadURL: {
                    type: "string",
                    example:
                      "https://ecomap.784bc7a3c0d83b650c8a4d303d266c50.r2.cloudflarestorage.com/uploads/2970025c-401c-4774-b26d-512bf9b4b9c3-video-teste.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=d7742950e82e06b562e052e02c65cfac%2F20250705%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250705T194540Z&X-Amz-Expires=120&X-Amz-Signature=35342f61828d62e0160782418ffffe8a7eded15a64bc52b637b4b0dcf52be314&X-Amz-SignedHeaders=host&x-amz-checksum-crc32=AAAAAA%3D%3D&x-amz-sdk-checksum-algorithm=CRC32&x-id=PutObject",
                    description:
                      "URL assinada para upload direto (válida por 120 segundos)",
                  },
                  fileURL: {
                    type: "string",
                    example:
                      "https://pub-f909a197a9fc4616b32ef8a024590295.r2.dev/uploads/2970025c-401c-4774-b26d-512bf9b4b9c3-video-teste.mp4",
                    description:
                      "URL pública para acesso ao arquivo após upload",
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
                    example:
                      "fileName, contentType e extention são obrigatórios",
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
          description: "Erro ao gerar URL",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Erro ao gerar URL de upload",
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
