import { Router } from "express";
import { register, login, getMe } from "../controllers/auth.controller.js";
import {
  registerValidator,
  loginValidator,
} from "../validator/auth.validator.js";
import { verifyEmail } from "../controllers/auth.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", registerValidator, register);

authRouter.post("/login", loginValidator, login);

authRouter.get("/get-me", authUser, getMe);
authRouter.get("/verify-email", verifyEmail);

export default authRouter;
