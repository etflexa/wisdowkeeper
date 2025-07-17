import { Router } from "express";
import {
  createEnterpriseController,
  createUserEnterpriseController,
  deleteUserController,
  listAllUsersController,
  listEnterpriseController,
  listUserController,
  loginEnterpriseController,
  sendAccessCredentialsToUserController,
  softDeleteEnterpriseController,
  updateUserController
} from "../controllers/enterprise.js";
import auth from "../middleware/auth.js";

export const enterpriseRoutes = Router();

enterpriseRoutes.post("", createEnterpriseController);

enterpriseRoutes.post("/login", loginEnterpriseController);

enterpriseRoutes.get("/:id", auth, listEnterpriseController);

enterpriseRoutes.delete("/:id", auth, softDeleteEnterpriseController);

enterpriseRoutes.post("/:id/users", auth, createUserEnterpriseController);

enterpriseRoutes.get("/:id/users", auth, listAllUsersController);

enterpriseRoutes.get("/:id/users/:userId", listUserController);

enterpriseRoutes.patch("/:id/users", auth, updateUserController);

enterpriseRoutes.delete("/:id/users", auth, deleteUserController);

enterpriseRoutes.post(
  "/:id/users/credentials",
  auth,
  sendAccessCredentialsToUserController
);
