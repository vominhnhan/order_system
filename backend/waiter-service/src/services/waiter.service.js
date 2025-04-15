import { getChannel } from "../common/config/rabbitmq.config.js";
import prisma from "../common/prisma/init.prisma.js";
import axios from "axios";

const waiterService = {
  openTable: async (req) => {
    const { table_id, secret_code } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    // Gọi Secret Code Service để kiểm tra mã code
    try {
      const response = await axios.post(
        "http://localhost:3005/api/secret/verify",
        { code: secret_code },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token cùng request
          },
        }
      );

      // In log để debug Secret Code Service response
      console.log("Secret Code Service response:", response.data);

      // Kiểm tra phản hồi - đảm bảo key metaData được truy cập chính xác
      if (response.data.status !== "success" || !response.data.metaData) {
        throw new Error(response.data.message || "Mã code không hợp lệ");
      }
    } catch (error) {
      console.error("Secret Code verification failed:", error.message);
      throw new Error("Mã code không hợp lệ");
    }

    // Kiểm tra trạng thái bàn
    const numericTableId = Number(table_id);
    const table = await prisma.table.findUnique({
      where: { id: numericTableId },
    });

    if (!table) {
      throw new Error("Table not found");
    }

    if (table.status === "OCCUPIED") {
      throw new Error("Table is already occupied");
    }

    // Thực hiện transaction cập nhật trạng thái bàn và tạo đơn hàng mới
    const result = await prisma.$transaction(async (tx) => {
      // Cập nhật trạng thái bàn (chuyển thành OCCUPIED)
      const updatedTable = await tx.table.update({
        where: { id: numericTableId },
        data: { status: "OCCUPIED" },
      });

      // Tạo đơn hàng mới với order status = "PENDING" và tổng tiền 0
      const newOrder = await tx.order.create({
        data: {
          table_id: numericTableId,
          status: "PENDING",
          total_price: 0,
        },
      });

      return { table: updatedTable, order: newOrder };
    });

    return result;
  },

  getTables: async (req) => {
    const tables = await prisma.table.findMany({
      where: {
        status: "AVAILABLE",
      },
    });

    return tables;
  },

  sendOrder: async (req) => {
    const { order_id, items } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    // Kiểm tra đơn hàng tồn tại
    const order = await prisma.order.findUnique({
      where: { id: Number(order_id) },
    });
    if (!order) {
      throw new Error("Order not found");
    }

    // Transaction
    const updatedOrder = await prisma.$transaction(async (tx) => {
      let totalPrice = 0;

      for (const item of items) {
        if (Number(item.quantity) > 0) {
          // Gọi Product Service để lấy giá
          const productRes = await axios.get(
            `http://localhost:3004/api/products/${item.product_id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Gửi token cùng request
              },
            }
          );
          if (
            productRes.data.status === "success" &&
            productRes.data.metaData
          ) {
            const productPrice = productRes.data.metaData.price || 0;

            // Tạo order_item với status = PREPARING
            await tx.order_item.create({
              data: {
                order_id: Number(order_id),
                product_id: Number(item.product_id),
                quantity: Number(item.quantity),
                status: "PREPARING",
                price: productPrice, // Nếu cột 'price' ở order_item có sẵn
              },
            });

            totalPrice += productPrice * Number(item.quantity);
          } else {
            console.error("Không lấy được giá product_id =", item.product_id);
          }
        }
      }

      // Cập nhật order
      const newOrder = await tx.order.update({
        where: { id: Number(order_id) },
        data: {
          total_price: totalPrice,
          status: "SUBMITTED", // hoặc "PENDING" tuỳ nghiệp vụ
        },
        include: { order_items: true },
      });

      return newOrder;
    });

    return updatedOrder;
  },

  // Hàm xử lý cập nhật trạng thái món ăn
  toggleAvailability: async (req, product_id, is_available) => {
    try {
      console.log(
        "Received request to update product:",
        product_id,
        "Availability:",
        is_available
      );

      // Kiểm tra xem sản phẩm có tồn tại không
      const product = await prisma.product.findUnique({
        where: { id: product_id },
      });

      if (!product) {
        throw new Error("Sản phẩm không tồn tại");
      }

      // Cập nhật trạng thái is_available
      await prisma.product.update({
        where: { id: product_id },
        data: { is_available: is_available },
      });

      console.log(
        `Product ${product_id} availability updated to ${is_available}`
      );

      // Trả về thông báo thành công
      return { message: "Trạng thái món ăn đã được cập nhật" };
    } catch (error) {
      console.log("Error updating availability:", error.message);
      throw new Error(error.message);
    }
  },
};

export default waiterService;
