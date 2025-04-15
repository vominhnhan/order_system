import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import secretRouter from "./routes/secret.router.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3005;

// Cấu hình CORS cho phép frontend từ localhost:5500
app.use(cors({
  origin: "http://127.0.0.1:5500",  // Chỉ cho phép frontend từ localhost:5500
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

app.use("/api/secret", secretRouter);

app.listen(PORT, () => {
  console.log(`Secret Code Service running on port ${PORT}`);
});
