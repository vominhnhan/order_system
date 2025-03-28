import express from "express";
import dotenv from "dotenv";
import waiterRouter from "./routes/waiter.router.js";

dotenv.config();
const app = express();
app.use(express.json());

// Gán route cho waiter service
app.use("/api/waiter", waiterRouter);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Waiter Service running on port ${PORT}`);
});
