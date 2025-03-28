import e from "express";
import {
  responseError,
  responseSuccess,
} from "../common/helpers/response.helper.js";
import secretService from "../services/secret.service.js";

const secretController = {
  generate: async (req, res) => {
    try {
      const data = await secretService.generate();
      const resData = responseSuccess(data, `Tạo mã thành công`, 200);
      res.status(resData.code).json(resData);
    } catch (error) {
      console.log(error);
      const resData = responseError(error.message, 400);
      res.status(resData.code).json(resData);
    }
  },
  verify: async (req, res) => {
    try {
      const data = await secretService.verify(req);
      const resData = responseSuccess(data, `Xác thực mã thành công`, 200);
      res.status(resData.code).json(resData);
    } catch (error) {
      const resData = responseError(error.message, 400);
      res.status(resData.code).json(resData);
    }
  },
};

export default secretController;
