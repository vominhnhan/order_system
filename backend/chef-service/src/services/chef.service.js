import prisma from "../common/prisma/init.prisma.js";
import axios from "axios";

const chefService = {
  getOrders: async (req) => {
    const items = await prisma.order_item.findMany({
      where: {
        status: { in: ["PENDING", "PREPARING"] },
      },
      include: {
        order: {
          select: {
            table_id: true,
            created_at: true,
          },
        },
      },
    });
    const token = req.headers.authorization?.split(" ")[1];
    // Với mỗi order item, gọi API của Product Service để lấy thông tin sản phẩm dựa trên product_id
    const ordersWithProduct = await Promise.all(
      items.map(async (item) => {
        let productName = "N/A";
        try {
          // Giả sử API Product Service có endpoint GET /api/products/:id trả về JSON chứa dữ liệu sản phẩm
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
            productName = productRes.data.metaData.name;
          }
        } catch (err) {
          console.error(
            `Error fetching product data for product_id ${item.product_id}:`,
            err.message
          );
        }

        return {
          id: item.id,
          dish: productName,
          quantity: item.quantity,
          table: item.order.table_id,
          note: item.notes || "",
          time: item.created_at,
          status: item.status,
        };
      })
    );

    return ordersWithProduct;
  },
  completeOrderItem: async (req) => {
    const { id } = req.params;
    const updatedItem = await prisma.order_item.update({
      where: {
        id: Number(id),
      },
      data: {
        status: "COMPLETED",
      },
    });
    return updatedItem;
  },

  cancelOrderItem: async (req) => {
    const { id } = req.params;
    const updatedItem = await prisma.order_item.update({
      where: {
        id: Number(id),
      },
      data: {
        status: "CANCELLED",
      },
    });
    return updatedItem;
  },
};

export default chefService;
