import express from "express";
import authController from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/register", authController.userRegister);
authRouter.post("/logIn", authController.userLogIn);

export default authRouter;