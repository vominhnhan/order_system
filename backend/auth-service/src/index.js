import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/auth.router.js";


dotenv.config();
const app = express();


app.use(cors());


app.use(express.json());

app.use("/api/auth", authRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Auth Service is listening on port ${PORT}`);
});
