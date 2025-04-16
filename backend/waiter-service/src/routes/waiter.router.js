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

// Lấy danh sách bàn
waiterRouter.get(
  "/tables",
  authMiddleware,
  authorizeRoles("waiter", "manager"),
  waiterController.getTables
);

// Gửi đơn hàng
waiterRouter.post(
  "/order/send",
  authMiddleware,
  authorizeRoles("waiter", "manager"),
  waiterController.sendOrder
);

waiterRouter.post(
  "/product/toggle-availability",
  authMiddleware,
  authorizeRoles("manager"), // Only manager can toggle availability
  waiterController.toggleAvailability
);

export default waiterRouter;
