import express from "express";
import {
  authMiddleware,
  authorizeRoles,
} from "../middlewares/auth.middleware.js";
import chefController from "../controllers/chef.controller.js";

const chefRouter = express.Router();

chefRouter.get(
  "/orders",
  authMiddleware,
  authorizeRoles("chef"),
  chefController.getOrders
);

// Endpoint chuyển trạng thái order_item sang COMPLETED
chefRouter.patch(
  "/orders/:id/complete",
  authMiddleware,
  authorizeRoles("chef"),
  chefController.completeOrderItem
);

// Endpoint chuyển trạng thái order_item sang CANCELLED
chefRouter.patch(
  "/orders/:id/cancel",
  authMiddleware,
  authorizeRoles("chef"),
  chefController.cancelOrderItem
);

export default chefRouter;
