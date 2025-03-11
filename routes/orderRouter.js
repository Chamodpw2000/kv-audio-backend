import express from "express";
import { approveOrRejectOrder, createOrder, getAllOrders, getQuote } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/", createOrder);
orderRouter.post("/quote",getQuote);
orderRouter.get("/get",getAllOrders);
orderRouter.put("/status/:orderId",approveOrRejectOrder);
export default orderRouter;