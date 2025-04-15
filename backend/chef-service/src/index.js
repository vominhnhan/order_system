import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import chefRouter from "./routes/chef.router.js";
import { connectRabbitMQ, consumeOrderQueue } from "./common/rabbitmq.js";
import prisma from "./common/prisma/init.prisma.js";
import chefService from "./services/chef.service.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/chef", chefRouter);

const startRabbitMQConsumer = async () => {
  try {
    await connectRabbitMQ();
    console.log("📡 Đã kết nối RabbitMQ. Lắng nghe đơn hàng...");

    await consumeOrderQueue(async (order) => {
      await chefService.handleNewOrder(order);
    });
  } catch (error) {
    console.error("❌ Lỗi khi lắng nghe RabbitMQ:", error);
  }
};

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log(`🚀 Chef Service đang chạy tại http://localhost:${PORT}`);
  startRabbitMQConsumer();
});