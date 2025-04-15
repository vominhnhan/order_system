import chefService from "../services/chef.service.js";
import {
  responseError,
  responseSuccess,
} from "../common/helpers/response-helper.js";

const chefController = {
  getOrders: async (req, res) => {
    try {
      const data = await chefService.getPendingOrders();
      const resData = responseSuccess(data, "Lấy danh sách đơn hàng thành công", 200);
      res.status(resData.code).json(resData);
    } catch (error) {
      const resData = responseError(error.message, 500);
      res.status(resData.code).json(resData);
    }
  },
};

export default chefController