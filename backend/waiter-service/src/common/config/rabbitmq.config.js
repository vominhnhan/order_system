import amqplib from "amqplib";

let channel;

export async function connectRabbitMQ() {
  try {
    const connection = await amqplib.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    // Khai báo exchange trước khi sử dụng
    await channel.assertExchange("order_exchange", "direct", { durable: true });
    console.log("Connected to RabbitMQ");
    return channel;
  } catch (error) {
    console.error("RabbitMQ connection error:", error);
    throw error;
  }
}

export function getChannel() {
  if (!channel) {
    throw new Error("RabbitMQ channel not initialized");
  }
  return channel;
}
