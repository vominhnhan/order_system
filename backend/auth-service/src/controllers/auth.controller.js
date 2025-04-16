import {
  responseError,
  responseSuccess,
} from "../common/helpers/response.helper.js";
import authService from "../services/auth.service.js";

const authController = {
  login: async (req, res) => {
    try {
      const data = await authService.login(req);
      const resData = responseSuccess(data, `Đăng nhập thành công`, 200);
      res.status(resData.code).json(resData);
    } catch (error) {
      const resData = responseError(error.message, 401);
      res.status(resData.code).json(resData);
    }
  },

  getInfo: async (req, res) => {
    try {
      const data = await authService.getInfo(req);
      const resData = responseSuccess(data, `Lấy thông tin thành công`, 200);
      res.status(resData.code).json(resData);
    } catch (error) {
      const resData = responseError(error.message, 401);
      res.status(resData.code).json(resData);
    }
  },

  logout: async (req, res) => {
    return res.json({ status: "success", message: "Đăng xuất thành công!" });
  },
};

export default authController;
