import { getChannel } from "../common/config/rabbitmq.config.js";
import prisma from "../common/prisma/init.prisma.js";
import axios from "axios";

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
        status: "PENDING",
        total_price: 0,
      },
    });

    return { table, order };
  },

  addOrderItem: async (req) => {
    const { order_id, product_id, quantity, note } = req.body;

    // Lấy thông tin đơn hàng
    const order = await prisma.order.findUnique({
      where: {
        id: Number(order_id),
      },
    });
    console.log({ order });

    let new_order_id = order_id;

    // Nếu order hiện tại đã SUBMITTED, tìm một đơn hàng PENDING cho cùng table_id
    if (order.status !== "PENDING") {
      const pendingOrder = await prisma.order.findFirst({
        where: {
          table_id: order.table_id,
          status: "PENDING",
        },
        orderBy: {
          created_at: "desc", // Lấy đơn hàng mới nhất
        },
      });

      // Nếu tìm thấy đơn hàng PENDING, sử dụng order_id của nó
      if (pendingOrder) {
        new_order_id = pendingOrder.id; // Cập nhật order_id mới
        console.log("Dùng đơn hàng đã có:", new_order_id);
      } else {
        // Nếu không tìm thấy order PENDING, tạo order mới
        const newOrder = await prisma.order.create({
          data: {
            table_id: order.table_id,
            status: "PENDING",
            total_price: 0,
          },
        });
        new_order_id = newOrder.id; // Cập nhật order_id mới
        console.log("Tạo đơn hàng mới:", new_order_id);
      }
    }

    console.log({ new_order_id });
    // Gọi Product Service để lấy thông tin sản phẩm
    const productServiceUrl =
      process.env.PRODUCT_SERVICE_URL || "http://localhost:3004";

    const productResponse = await axios.get(
      `${productServiceUrl}/api/products/${product_id}`
    );
    const product = productResponse.data;

    if (!product || !product.metaData.is_available) {
      throw new Error("Sản phẩm không tồn tại");
    }

    // Tạo order_item với trạng thái PENDING
    const orderItem = await prisma.order_item.create({
      data: {
        order_id: Number(new_order_id),
        product_id: Number(product_id),
        quantity: Number(quantity),
        price: product.metaData.price * Number(quantity),
        notes: note,
      },
    });

    // Cập nhật tổng tiền của Order tương ứng
    await prisma.order.update({
      where: {
        id: new_order_id,
      },
      data: {
        total_price: {
          increment: product.metaData.price * Number(quantity),
        },
      },
    });

    // Gửi sự kiện new_order_created qua RabbitMQ
    const channel = getChannel();
    const event = {
      event: "new_order_created",
      data: {
        order_id: new_order_id,
        order_item_id: orderItem.id,
        product_id,
        quantity,
        price: product.metaData.price * Number(quantity),
        note,
      },
    };

    channel.publish(
      "order_exchange",
      "order_created",
      Buffer.from(JSON.stringify(event))
    );
    console.log("Sự kiện new_order_created đã được gửi tới RabbitMQ:", event);

    return { orderItem: orderItem };
  },

  sendOrder: async (req) => {
    const { order_id } = req.body;

    // Kiểm tra order
    const order = await prisma.order.findUnique({
      where: {
        id: Number(order_id),
      },
    });

    // Cập nhật đơn hàng sang SUBMITTED nếu nó vẫn đang ở trạng thái PENDING
    if (order.status == "PENDING") {
      await prisma.order.update({
        where: {
          id: Number(order_id),
        },
        data: { status: "SUBMITTED" },
      });
    }

    // Cập nhật trạng thái của tất cả các Order_item liên quan từ PENDING sang PREPARING
    await prisma.order_item.updateMany({
      where: {
        order_id: Number(order_id),
        status: "PENDING",
      },
      data: {
        status: "PREPARING",
      },
    });

    // Gửi sự kiện order_sent qua RabbitMQ tới Chef Service
    const channel = getChannel();
    const event = {
      event: "order_sent",
      data: {
        order_id,
      },
    };
    channel.publish(
      "order_exchange",
      "order.submitted",
      Buffer.from(JSON.stringify(event))
    );
    console.log("Sự kiện order_sent đã được gửi tới RabbitMQ:", event);

    const updateOrder = await prisma.order.findUnique({
      where: {
        id: Number(order_id),
      },
    });

    return updateOrder;
  },
};

export default waiterService;
