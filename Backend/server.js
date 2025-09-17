import express from "express";
const app = express();
import cors from "cors";
import dotenv from "dotenv";
import databaseConnection from "./config/mongoDB.js";
import reportRouter from "./routes/reportRoute.js";
import recordingRouter from "./routes/recordingRoute.js";
import authRouter from "./routes/authRoute.js";

dotenv.config();
databaseConnection();

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use("/user", reportRouter);
app.use("/user", recordingRouter);
app.use("/user", authRouter)

app.listen(3000, () => console.log("Server running on port 3000"));
