import amqp from "amqplib";

let channel;

export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue("payment_queue", { durable: true });
    console.log("Đã kết nối RabbitMQ và tạo queue payment_queue");
    return channel;
  } catch (error) {
    console.error("Lỗi kết nối RabbitMQ:", error);
    throw error;
  }
};

export const consumePaymentQueue = async (callback) => {
  if (!channel) {
    await connectRabbitMQ();
  }
  channel.consume("payment_queue", (msg) => {
    if (msg !== null) {
      const paymentData = JSON.parse(msg.content.toString());
      callback(paymentData);
      channel.ack(msg);
    }
  });
};