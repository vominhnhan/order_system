import express from "express";
import secretController from "../controllers/secret.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const secretRouter = express.Router();

secretRouter.post("/generate", authMiddleware, secretController.generate);
secretRouter.post("/verify", secretController.verify);

export default secretRouter;
