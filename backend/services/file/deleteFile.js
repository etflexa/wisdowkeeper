import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { AppError } from "../../middleware/appError.js";
import "dotenv/config";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = "ecomap";

export async function deleteFile(data) {
  const { fileURL } = data;

  if (!fileURL) {
    throw new AppError("Campo obrigatório não enviado");
  }

  const fileKey = fileURL.split("r2.dev/")[1];

  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
  });

  try {
    await s3.send(command);
  } catch (error) {
    console.error(error);
    throw new AppError("Erro ao deletar o arquivo do bucket", 500);
  }
}
