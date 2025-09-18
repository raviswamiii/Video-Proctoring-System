import express from "express";
import dotenv from "dotenv";
import { databaseConnection } from "./config/mongoDB.js";

const app = express();
const port = 3000;

dotenv.config();
databaseConnection();



app.listen(port, () => {
    console.log(`Server is running on port ${port}.`)
})