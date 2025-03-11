import express from "express";
import { AddUser, getAllUsers, getUserProfile, handleBlockUser, userLogin } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register",AddUser);
userRouter.post("/login",userLogin);
userRouter.get("/all",getAllUsers);
userRouter.get("/block/:email",handleBlockUser);
userRouter.get("/",getUserProfile);



export default userRouter;