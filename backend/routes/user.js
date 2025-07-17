import { Router } from "express";
import { loginUserController } from "../controllers/user.js";

export const userRoutes = Router();

userRoutes.post("/login", loginUserController);
