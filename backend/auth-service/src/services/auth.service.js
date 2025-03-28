import prisma from "../common/prisma/init.prisma.js";
import jwt from "jsonwebtoken";

const authService = {
  login: async (req) => {
    const { username, password } = req.body;
    const user = await prisma.users.findUnique({
      where: {
        username: username,
      },
    });
    if (!user) {
      throw new Error("Tài khoản không tồn tại");
    }

    if (user.password !== password) {
      throw new Error("Mật khẩu không đúng");
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    return token;
  },

  getInfo: async (req) => {
    console.log({ user: req.user });
    return req.user;
  },
};

export default authService;
