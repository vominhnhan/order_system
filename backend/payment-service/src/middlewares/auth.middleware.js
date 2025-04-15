import jwt from "jsonwebtoken";
import axios from "axios";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        message: "Vui lòng cung cấp token để tiếp tục sử dụng",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const response = await axios.get(`${process.env.AUTH_SERVICE_URL}/api/auth/get-info`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const user = response.data.metaData;
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token không hợp lệ" });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Bạn không có quyền truy cập" });
    }
    next();
  };
};