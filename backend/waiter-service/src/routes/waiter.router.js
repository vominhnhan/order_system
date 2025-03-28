import express from "express";
import waiterController from "../controllers/waiter.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const waiterRouter = express.Router();

// Endpoint mở bàn: tạo bàn mới và đơn hàng mới
waiterRouter.post("/open-table", authMiddleware, waiterController.openTable);

// Endpoint thêm món vào đơn hàng
waiterRouter.post("/add-item", authMiddleware, waiterController.addOrderItem);

export default waiterRouter;
