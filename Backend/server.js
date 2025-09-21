import express from "express";
import dotenv from "dotenv";
import databaseConnection from "./config/mongoDB.js";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";

const app = express();
const port = 3000;

dotenv.config();
databaseConnection();

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use("/user", authRouter)

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
