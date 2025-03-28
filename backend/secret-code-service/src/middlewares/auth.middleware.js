import jwt from "jsonwebtoken";
import prisma from "../common/prisma/init.prisma.js";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Vui lòng cung cấp token để tiếp tục sử dụng",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (decoded.role !== "manager") {
      return res.status(401).json({ message: "Không có quyền truy cập" });
    }

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token không hợp lệ" });
  }
};
