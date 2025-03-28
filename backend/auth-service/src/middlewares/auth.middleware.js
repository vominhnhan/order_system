import jwt from "jsonwebtoken";
import prisma from "../common/prisma/init.prisma.js";

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

    const user = await prisma.users.findFirst({
      where: {
        id: decoded.user_id,
        role: decoded.role,
      },
    });
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token không hợp lệ" });
  }
};
