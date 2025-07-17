import { loginUser } from "../services/user/login.js";

async function loginUserController(req, res, next) {
  try {
    const data = req.body;
    const result = await loginUser(data);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export { loginUserController };
