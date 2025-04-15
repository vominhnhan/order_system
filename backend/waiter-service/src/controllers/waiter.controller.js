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

  getTables: async (req, res) => {
    try {
      const data = await waiterService.getTables();
      const resData = responseSuccess(
        data,
        `Lấy danh sách bàn thành công`,
        201
      );
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

  toggleAvailability: async (req, res) => {
    const { product_id, is_available } = req.body;
    try {
      const data = await waiterService.toggleAvailability(
        req,
        product_id,
        is_available
      );
      const resData = responseSuccess(
        data,
        `Cập nhật trạng thái món ăn thành công`,
        200
      );
      res.status(resData.code).json(resData);
    } catch (error) {
      const resData = responseError(error.message, 500);
      res.status(resData.code).json(resData);
    }
  },
};

export default waiterController;
