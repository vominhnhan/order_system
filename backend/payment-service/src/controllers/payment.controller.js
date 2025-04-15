import {
  responseError,
  responseSuccess,
} from "../common/helpers/response.helper.js";
import paymentService from "../services/payment.service.js";

const paymentController = {
  createPayment: async (req, res) => {
    try {
      const data = await paymentService.createPayment(req.body);
      const resData = responseSuccess(data, `Tạo phiếu thanh toán thành công`, 201);
      res.status(resData.code).json(resData);
    } catch (error) {
      const resData = responseError(error.message, 500);
      res.status(resData.code).json(resData);
    }
  },

  getPaymentHistory: async (req, res) => {
    try {
      const { year, month, day } = req.query;
      const data = await paymentService.getPaymentHistory(year, month, day);
      const resData = responseSuccess(data, `Lấy lịch sử thanh toán thành công`, 200);
      res.status(resData.code).json(resData);
    } catch (error) {
      const resData = responseError(error.message, 500);
      res.status(resData.code).json(resData);
    }
  },

  getAllPayments: async (req, res) => {
    try {
      const data = await paymentService.getAllPayments();
      const resData = responseSuccess(data, `Lấy danh sách thanh toán thành công`, 200);
      res.status(resData.code).json(resData);
    } catch (error) {
      const resData = responseError(error.message, 500);
      res.status(resData.code).json(resData);
    }
  },
};

export default paymentController;