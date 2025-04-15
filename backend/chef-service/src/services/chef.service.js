import prisma from "../common/prisma/init.prisma.js";

const chefService = {
  async handleNewOrder(order) {
    return await prisma.order.create({
      data: {
        tableNumber: order.tableNumber,
        items: order.items,
        status: "pending",
      },
    });
  },

  async updateOrderStatus(orderId, status) {
    return await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  },

  async getPendingOrders() {
    return await prisma.order.findMany({
      where: { status: "pending" },
      orderBy: { createdAt: "asc" },
    });
  },
};

export default chefService;