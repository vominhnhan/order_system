import express from "express";
import dotenv from "dotenv";
import waiterRouter from "./routes/waiter.router.js";
import { connectRabbitMQ } from "./common/config/rabbitmq.config.js";

dotenv.config();
const app = express();
app.use(express.json());

// Gán route cho waiter service
app.use("/api", waiterRouter);

const PORT = process.env.PORT || 3002;

(async () => {
  try {
    await connectRabbitMQ();
    app.listen(PORT, () => {
      console.log(`Waiter Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting Waiter Service:", error);
  }
})();
