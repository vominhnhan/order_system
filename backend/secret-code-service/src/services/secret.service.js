import prisma from "../common/prisma/init.prisma.js";

const secretService = {
  generate: async () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const expiredAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.secret_code.create({
      data: {
        code: code,
        expired_at: expiredAt,
      },
    });
    return code;
  },
  verify: async (req) => {
    const { code } = req.body;
    const checkCode = await prisma.secret_code.findFirst({
      where: {
        code: code,
        expired_at: {
          gte: new Date(),
        },
      },
    });
    if (!checkCode) {
      throw new Error("Mã không hợp lệ");
    }

    return checkCode.code;
  },
};

export default secretService;
