import {
  responseError,
  responseSuccess,
} from "../common/helpers/response.helper.js";
import waiterService from "../services/waiter.service.js";

const waiterController = {
  openTable: async (req, res) => {
    try {
      const data = await waiterService.openTable(req);
      const resData = responseSuccess(data, `Mở bàn thành công`, 200);
      res.status(resData.code).json(resData);
    } catch (error) {
      const resData = responseError(error.message, 500);
      res.status(resData.code).json(resData);
    }
  },

  addOrderItem: async (req, res) => {
    try {
      const data = await waiterService.addOrderItem(req);
      const resData = responseSuccess(data, `Thêm món thành công`, 201);
      res.status(resData.code).json(resData);
    } catch (error) {
      console.log(error);
      const resData = responseError(error.message, 500);
      res.status(resData.code).json(resData);
    }
  },

  sendOrder: async (req, res) => {
    try {
      const data = await waiterService.sendOrder(req);
      const resData = responseSuccess(data, `Gửi đơn hàng thành công`, 201);
      res.status(resData.code).json(resData);
    } catch (error) {
      console.log(error);
      const resData = responseError(error.message, 500);
      res.status(resData.code).json(resData);
    }
  },
};

export default waiterController;
