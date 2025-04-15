import express from "express";
import productController from "../controllers/product.controller.js";
import {
  authMiddleware,
  authorizeRoles,
} from "../middlewares/auth.middleware.js";
import upload from "../common/multer/upload.multer.js";

const productRouter = express.Router();

// Tạo danh mục mới
productRouter.post(
  "/category",
  authMiddleware,
  authorizeRoles("manager"),
  productController.addCategory
);
// Lấy tất cả danh mục
productRouter.get(
  "/category",
  authMiddleware,
  authorizeRoles("manager", "waiter"),
  productController.getAllCategory
);
// Cập nhật danh mục
productRouter.patch(
  "/category/:id",
  authMiddleware,
  authorizeRoles("manager"),
  productController.updateCategory
);

// Tạo mới sản phẩm
productRouter.post(
  "/products",
  authMiddleware,
  authorizeRoles("manager"),
  upload.single("image"),
  productController.addProduct
);
// Lấy 1 sản phẩm theo id
productRouter.get("/products/:id", productController.getProductById);
// Lấy tất cả sản phẩm theo danh mục
productRouter.get(
  "/products/category/:id",
  productController.getProductsByCategory
);
// Cập nhật sản phẩm
productRouter.patch(
  "/products/:id",
  authMiddleware,
  authorizeRoles("manager"),
  productController.updateProduct
);
// Xóa sản phẩm
productRouter.delete(
  "/products/:id",
  authMiddleware,
  authorizeRoles("manager"),
  productController.removeProduct
);
// Cập nhật trạng thái món
productRouter.patch(
  "/products/:id/availability",
  authMiddleware,
  authorizeRoles("chef", "manager"),
  productController.setProductAvailability
);

export default productRouter;
