import express from "express";
import { getReport } from "../controllers/reportController.js";
const reportRouter = express.Router();

reportRouter.get("/report", getReport);

export default reportRouter;