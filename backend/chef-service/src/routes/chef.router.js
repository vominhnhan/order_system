import express from "express";
import chefController from "../controllers/chef.controller.js";
import {
  authMiddleware,
  authorizeRoles,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
  "/orders",
  authMiddleware,
  authorizeRoles("chef", "manager"),
  chefController.getOrders
);

export default router;