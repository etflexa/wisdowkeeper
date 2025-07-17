import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { AppError } from "../../middleware/appError.js";
import { randomUUID } from "crypto";
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

export async function createUploadURL(data) {
  const { fileName, extention, contentType } = data;

  if (!fileName || !extention || !contentType) {
    throw new AppError("Campo(s) obrigatório não enviado");
  }

  const filenNameUpload = `${randomUUID()}-${fileName}.${extention}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: `uploads/${filenNameUpload}`,
    ContentType: `${contentType}`,
  });

  try {
    const uploadURL = await getSignedUrl(s3, command, { expiresIn: 120 });
    const fileURL = `https://${process.env.SUBDOMAIN_R2_ID}.r2.dev/uploads/${filenNameUpload}`;

    return { uploadURL, fileURL };
  } catch (error) {
    throw new AppError("Erro ao gerar URL de upload");
  }
}
