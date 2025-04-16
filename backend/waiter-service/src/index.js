import express from "express";
import dotenv from "dotenv";
import waiterRouter from "./routes/waiter.router.js";
import { connectRabbitMQ } from "./common/config/rabbitmq.config.js";
import cors from "cors";

dotenv.config();
const app = express();

// app.use(cors());
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5500", "http://127.0.0.1:5500"], // Cho phép các origin này
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true, // Cho phép gửi cookie cùng với yêu cầu
  })
);

// Gán route cho waiter service
app.use("/api", waiterRouter);

// API xử lý cập nhật trạng thái is_available
app.post("/api/products/toggle-availability", async (req, res) => {
  const { product_id, is_available } = req.body;

  try {
    // Cập nhật trong cơ sở dữ liệu (MySQL)
    const query = "UPDATE product SET is_available = ? WHERE id = ?";
    await db.execute(query, [is_available, product_id]);

    res.json({ status: "success", message: "Cập nhật trạng thái thành công" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "error", message: "Lỗi khi cập nhật trạng thái" });
  }
});

app.options("*", cors()); // Xử lý tất cả các yêu cầu OPTIONS

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
