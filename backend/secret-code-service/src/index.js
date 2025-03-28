import express from "express";
import dotenv from "dotenv";
import secretRouter from "./routes/secret.router.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3005;

app.use(express.json());

app.use("/api/secret", secretRouter);

app.listen(PORT, () => {
  console.log(`Secret Code Service running on port ${PORT}`);
});
