import prisma from "../common/prisma/init.prisma.js";

const paymentService = {
  createPayment: async (data) => {
    const { orderId, tableNumber, totalAmount } = data;
    const payment = await prisma.payment.create({
      data: {
        orderId,
        tableNumber,
        totalAmount,
        status: "completed",
      },
    });
    return payment;
  },

  getPaymentHistory: async (year, month, day) => {
    const whereClause = { status: "completed" };
    if (year) {
      whereClause.createdAt = {
        gte: new Date(`${year}-01-01`),
        lte: new Date(`${year}-12-31`),
      };
    }
    if (month) {
      whereClause.createdAt = {
        gte: new Date(`${year}-${month}-01`),
        lte: new Date(`${year}-${month}-31`),
      };
    }
    if (day) {
      whereClause.createdAt = {
        gte: new Date(`${year}-${month}-${day}`),
        lte: new Date(`${year}-${month}-${day}T23:59:59`),
      };
    }

    const payments = await prisma.payment.findMany({ where: whereClause });
    return payments;
  },

  getAllPayments: async () => {
    const payments = await prisma.payment.findMany({
      where: { status: "completed" },
    });
    return payments;
  },
};

export default paymentService;