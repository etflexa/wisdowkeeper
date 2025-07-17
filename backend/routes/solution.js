import { Router } from "express";
import {
  createCategoryController,
  createSolutionController,
  createUploadURLController,
  deleteFileController,
  deleteSolutionController,
  listAllSolutionByEnterpriseController,
  listAllSolutionByUserController,
  listCategoriesController,
  listSolutionByIdController,
  updateSolutionController
} from "../controllers/solution.js";
import auth from "../middleware/auth.js";
import authUser from "../middleware/authUser.js";
import authGeneric from "../middleware/authGeneric.js";

export const solutionRoutes = Router();

solutionRoutes.post(
  "/categories/enterprises/:id",
  auth,
  createCategoryController
);

solutionRoutes.get("/categories/enterprises/:id", listCategoriesController);

solutionRoutes.post("/users/:id", authUser, createSolutionController);

solutionRoutes.get(
  "/auth/:id/enterprises/:enterpriseId",
  authGeneric,
  listAllSolutionByEnterpriseController
);

solutionRoutes.get(
  "/auth/:id/enterprises/:enterpriseId/users/:userId",
  authGeneric,
  listAllSolutionByUserController
);

solutionRoutes.get(
  "/:solutionId/auth/:id/enterprises/:enterpriseId",
  authGeneric,
  listSolutionByIdController
);

solutionRoutes.patch("/users/:id", authUser, updateSolutionController);

solutionRoutes.delete(
  "/:solutionId/auth/:id/enterprises/:enterpriseId/users/:userId",
  authGeneric,
  deleteSolutionController
);

solutionRoutes.post(
  "/auth/:id/file-url",
  authGeneric,
  createUploadURLController
);

solutionRoutes.delete("/auth/:id/file-url", authGeneric, deleteFileController);
