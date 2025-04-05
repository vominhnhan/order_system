import {
  responseError,
  responseSuccess,
} from "../common/helpers/response.helper.js";
import productService from "../services/product.service.js";

const productController = {
  // Category Controller
  addCategory: async (req, res) => {
    try {
      const data = await productService.addCategory(req);
      const resData = responseSuccess(data, `Thêm danh mục thành công`, 201);
      res.status(resData.code).json(resData);
    } catch (error) {
      const resData = responseError(error.message, 500);
      res.status(resData.code).json(resData);
    }
  },
  getAllCategory: async (req, res) => {
    try {
      const data = await productService.getAllCategory();
      const resData = responseSuccess(
        data,
        `Lấy danh sách danh mục thành công`,
        200
      );
      res.status(resData.code).json(resData);
    } catch (error) {
      const resData = responseError(error.message, 500);
      res.status(resData.code).json(resData);
    }
  },
  updateCategory: async (req, res) => {
    try {
      const data = await productService.updateCategory(req);
      const resData = responseSuccess(
        data,
        `Cập nhật danh mục thành công`,
        200
      );
      res.status(resData.code).json(resData);
    } catch (error) {
      const resData = responseError(error.message, 500);
      res.status(resData.code).json(resData);
    }
  },

  // Product Controller
  addProduct: async (req, res) => {
    try {
      const data = await productService.addProduct(req);
      const resData = responseSuccess(data, `Thêm sản phẩm thành công`, 201);
      res.status(resData.code).json(resData);
    } catch (error) {
      const resData = responseError(error.message, 500);
      res.status(resData.code).json(resData);
    }
  },
  getProductById: async (req, res) => {
    try {
      const data = await productService.getProductById(req);
      const resData = responseSuccess(
        data,
        `Lấy danh sách sản phẩm thành công`,
        200
      );
      res.status(resData.code).json(resData);
    } catch (error) {
      const resData = responseError(error.message, 500);
      res.status(resData.code).json(resData);
    }
  },
  getProductsByCategory: async (req, res) => {
    try {
      const data = await productService.getProductsByCategory(req);
      const resData = responseSuccess(
        data,
        `Lấy danh sách sản phẩm theo danh mục thành công`,
        200
      );
      res.status(resData.code).json(resData);
    } catch (error) {
      const resData = responseError(error.message, 500);
      res.status(resData.code).json(resData);
    }
  },
  updateProduct: async (req, res) => {
    try {
      const data = await productService.updateProduct(req);
      const resData = responseSuccess(
        data,
        `Cập nhật sản phẩm thành công`,
        200
      );
      res.status(resData.code).json(resData);
    } catch (error) {
      const resData = responseError(error.message, 500);
      res.status(resData.code).json(resData);
    }
  },
  removeProduct: async (req, res) => {
    try {
      const data = await productService.removeProduct(req);
      const resData = responseSuccess(data, `Xóa sản phẩm thành công`, 200);
      res.status(resData.code).json(resData);
    } catch (error) {
      const resData = responseError(error.message, 500);
      res.status(resData.code).json(resData);
    }
  },
  setProductAvailability: async (req, res) => {
    try {
      const data = await productService.setProductAvailability(req);
      const resData = responseSuccess(
        data,
        `Thay đổi trạng thái sản phẩm thành công`,
        200
      );
      res.status(resData.code).json(resData);
    } catch (error) {
      const resData = responseError(error.message, 500);
      res.status(resData.code).json(resData);
    }
  },
};

export default productController;
