import express from "express";
import waiterController from "../controllers/waiter.controller.js";
import {
  authMiddleware,
  authorizeRoles,
} from "../middlewares/auth.middleware.js";

const waiterRouter = express.Router();

// Tạo bàn mới và đơn hàng mới
waiterRouter.post(
  "/table/open",
  authMiddleware,
  authorizeRoles("waiter", "manager"),
  waiterController.openTable
);

// Gọi món
waiterRouter.post(
  "/order/add-item",
  authMiddleware,
  waiterController.addOrderItem
);

// Gửi đơn hàng
waiterRouter.post(
  "/order/send",
  authMiddleware,
  authorizeRoles("waiter", "manager"),
  waiterController.sendOrder
);

export default waiterRouter;
