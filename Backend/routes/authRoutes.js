import express from "express";
import authController from "../controllers/authController.js";
import authMilddleware from "../middlewares/authMilddleware.js";

const authRouter = express.Router();

authRouter.post("/register", authController.userRegister);
authRouter.post("/logIn", authController.userLogIn);
authRouter.post("/logout", authMilddleware, authController.userLogout);

export default authRouter;