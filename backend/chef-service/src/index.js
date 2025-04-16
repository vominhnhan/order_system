// src/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import chefRouter from "./routes/chef.router.js";

const app = express();

// Cấu hình middleware
app.use(cors());
app.use(express.json());

// Đăng ký route chef
app.use("/api/chef", chefRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Chef Service running on port ${PORT}`);
});
