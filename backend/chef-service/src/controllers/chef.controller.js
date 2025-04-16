import {
  responseError,
  responseSuccess,
} from "../common/helpers/response.helper.js";
import chefService from "../services/chef.service.js";

const chefController = {
  getOrders: async (req, res) => {
    try {
      const data = await chefService.getOrders(req);
      const resData = responseSuccess(data, `Lấy đơn hàng thành công`, 201);
      res.status(resData.code).json(resData);
    } catch (error) {
      console.log(error);
      const resData = responseError(error.message, 500);
      res.status(resData.code).json(resData);
    }
  },

  completeOrderItem: async (req, res) => {
    try {
      const data = await chefService.completeOrderItem(req);
      const resData = responseSuccess(
        data,
        `Chuyển trạng thái món hoàn thành`,
        201
      );
      res.status(resData.code).json(resData);
    } catch (error) {
      console.log(error);
      const resData = responseError(error.message, 500);
      res.status(resData.code).json(resData);
    }
  },

  cancelOrderItem: async (req, res) => {
    try {
      const data = await chefService.cancelOrderItem(req);
      const resData = responseSuccess(data, `Chuyển trạng thái món hủy`, 201);
      res.status(resData.code).json(resData);
    } catch (error) {
      console.log(error);
      const resData = responseError(error.message, 500);
      res.status(resData.code).json(resData);
    }
  },
};

export default chefController;
