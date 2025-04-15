import express from "express";
import paymentController from "../controllers/payment.controller.js";
import { authMiddleware, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  authorizeRoles("waiter", "manager"),
  paymentController.createPayment
);

router.get(
  "/history",
  authMiddleware,
  authorizeRoles("manager"),
  paymentController.getPaymentHistory
);

router.get(
  "/all",
  authMiddleware,
  authorizeRoles("manager"),
  paymentController.getAllPayments
);

export default router;