import express from "express";
import { AddUser, editUserProfile, getAllUsers, getUser,  getUserProfile, handleBlockUser, loginWithGoogle, sendOTP, userLogin, verifyOTP } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register",AddUser);
userRouter.post("/login",userLogin);
userRouter.get("/all",getAllUsers);
userRouter.get("/block/:email",handleBlockUser);
userRouter.get("/",getUserProfile);
userRouter.get("/getUser/:email",getUser);

userRouter.post("/googlelogin",loginWithGoogle);
userRouter.put("/update",editUserProfile);
userRouter.get("/sendOTP",sendOTP);
userRouter.post("/verifyEmail",verifyOTP);


export default userRouter;