import jwt from "jsonwebtoken";
import "dotenv/config";
import { AppError } from "./appError.js";

export default function authGeneric(req, res, next) {
  let token = req.headers.authorization;

  if (!token) {
    return next(new AppError("sem permissão para acessar o recurso", 401));
  }

  token = token.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET_KEY, (error, decoded) => {
    if (error) {
      return next(new AppError("sem permissão para acessar o recurso", 401));
    }

    if (decoded.sub !== req.params.id) {
      return next(new AppError("sem permissão para acessar o recurso", 401));
    }

    req.auth = {
      _id: decoded.sub,
    };

    return next();
  });
}
