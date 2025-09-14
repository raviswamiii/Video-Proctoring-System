import express from "express";
const app = express();
import cors from "cors";
import dotenv from "dotenv";
import databaseConnection from "./config/mongoDB.js";

dotenv.config();
databaseConnection();

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credential: true,
  })
);

app.listen(3000, () => console.log("Server running on port 5000"));
