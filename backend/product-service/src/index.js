import express from "express";
import dotenv from "dotenv";
import productRouter from "./routes/product.router.js";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3004;

app.use(express.json());

app.use(express.static("."));

app.use(cors());

app.use("/api", productRouter);

app.listen(PORT, () => {
  console.log(`Product Service running on port ${PORT}`);
});
