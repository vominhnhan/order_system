import express from "express";
import authController from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/login", authController.login);
authRouter.get("/get-info", authMiddleware, authController.getInfo);

export default authRouter;
