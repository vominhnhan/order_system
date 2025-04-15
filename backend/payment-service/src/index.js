import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import paymentRouter from "./routes/payment.router.js";
import { connectRabbitMQ, consumePaymentQueue } from "./common/rabbitmq.js";
import prisma from "./common/prisma/init.prisma.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/payment", paymentRouter);

// Lắng nghe thông tin thanh toán từ RabbitMQ
const startRabbitMQConsumer = async () => {
  try {
    await connectRabbitMQ();
    console.log("Bắt đầu lắng nghe thông tin thanh toán từ waiter-service...");
    consumePaymentQueue(async (paymentData) => {
      console.log("Nhận được thông tin thanh toán:", paymentData);
      // Lưu phiếu thanh toán vào cơ sở dữ liệu
      await prisma.payment.create({
        data: {
          orderId: paymentData.orderId,
          tableNumber: paymentData.tableNumber,
          totalAmount: paymentData.totalAmount,
          status: "completed",
        },
      });
      console.log("Đã lưu phiếu thanh toán vào cơ sở dữ liệu");
    });
  } catch (error) {
    console.error("Lỗi khi khởi động RabbitMQ consumer:", error);
  }
};

// Khởi động server và consumer
const PORT = process.env.PORT || 3008;
app.listen(PORT, () => {
  console.log(`Payment Service is listening on port ${PORT}`);
  startRabbitMQConsumer();
});