import prisma from "../common/prisma/init.prisma.js";

const waiterService = {
  openTable: async (req) => {
    const { table_id } = req.body;

    // Kiểm tra xem bàn có tồn tại và đang AVAILABLE
    const table = await prisma.table.findFirst({
      where: {
        id: table_id,
        status: "AVAILABLE",
      },
    });
    if (!table) {
      throw new Error("Bàn không có sẵn");
    }

    // Cập nhật trạng thái của bàn thành OCCUPIED
    await prisma.table.update({
      where: {
        id: table_id,
      },
      data: {
        status: "OCCUPIED",
      },
    });

    // Tạo đơn hàng mới cho bàn
    const order = await prisma.order.create({
      data: {
        table_id: table_id,
      },
    });

    return { table, order };
  },

  addOrderItem: async (req) => {
    const { order_id, product_id, quantity, price, note } = req.body;

    // Thêm món vào đơn hàng
    const orderItem = await prisma.order_item.create({
      data: {
        order_id,
        product_id,
        quantity,
        price,
        note,
      },
    });

    return orderItem;
  },
};

export default waiterService;
