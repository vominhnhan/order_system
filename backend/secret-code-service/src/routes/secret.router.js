import express from "express";
import secretController from "../controllers/secret.controller.js";
import {
  authMiddleware,
  authorizeRoles,
} from "../middlewares/auth.middleware.js";

const secretRouter = express.Router();

secretRouter.post(
  "/generate",
  authMiddleware,
  authorizeRoles("manager"),
  secretController.generate
);
secretRouter.post(
  "/verify",
  authMiddleware,
  authorizeRoles("waiter", "manager"),
  secretController.verify
);

export default secretRouter;
