import express from "express";
import { AddUser, userLogin } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register",AddUser);
userRouter.post("/login",userLogin);


export default userRouter;