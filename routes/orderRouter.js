import express from "express";
import { approveOrRejectOrder, createOrder, getAllOrders, getQuote } from "../controllers/orderController.js";
import { verifyOTP } from "../controllers/userController.js";

const orderRouter = express.Router();

orderRouter.post("/", createOrder);
orderRouter.post("/quote",getQuote);
orderRouter.get("/get",getAllOrders);
orderRouter.put("/status/:orderId",approveOrRejectOrder);
orderRouter.post("/verify-otp",verifyOTP);
export default orderRouter;