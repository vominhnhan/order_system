import amqp from "amqplib";

let channel;

export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue("order_queue", { durable: true });
    console.log("✅ Đã kết nối RabbitMQ và tạo queue order_queue");
    return channel;
  } catch (error) {
    console.error("❌ Lỗi kết nối RabbitMQ:", error);
    throw error;
  }
};

export const consumeOrderQueue = async (onMessage) => {
  if (!channel) {
    await connectRabbitMQ();
  }

  await channel.consume("order_queue", (msg) => {
    if (msg !== null) {
      const data = JSON.parse(msg.content.toString());
      console.log("📥 Nhận đơn hàng từ queue:", data);
      onMessage(data);
      channel.ack(msg);
    }
  });
};

export const sendToQueue = async (queue, message) => {
  if (!channel) {
    await connectRabbitMQ();
  }
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });
  console.log(`📤 Gửi message tới queue ${queue}:`, message);
};
