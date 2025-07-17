import express from "express";
import cors from "cors";
import "dotenv/config";
import conexaoMongoDB from "./database.js";
import { enterpriseRoutes } from "./routes/enterprise.js";
import { appErrorMiddleware } from "./middleware/appError.js";
import redoc from "redoc-express";
import swaggerSpec from "./swaggerConfig.js";
import { userRoutes } from "./routes/user.js";
import { solutionRoutes } from "./routes/solution.js";

const app = express();
app.use(express.json());
app.use(cors());

conexaoMongoDB();

app.get("/api", (req, res) => {
  res.status(200).send("API is running");
});

app.get("/docs-json", (req, res) => {
  res.json(swaggerSpec);
});

app.get(
  "/api-docs",
  redoc({
    title: "Documentação da API",
    specUrl: "/docs-json",
  })
);

app.use("/api/enterprises", enterpriseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/solutions", solutionRoutes);

app.use(appErrorMiddleware);

const port = parseInt(process.env.PORT) || 8080;
app.listen(port, () => {
  console.log(`Servidor online na porta ${port}`);
});
