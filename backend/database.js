import mongoose from "mongoose";
import "dotenv/config";

export default async function conexaoMongoDB() {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("Conectado ao MongoDB do wisdowkeeper");
  } catch (error) {
    console.log(`Erro: ${error}`);
  }
}
