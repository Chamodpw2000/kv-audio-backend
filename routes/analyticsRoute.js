import express from 'express';
import { productTypesData, getOrderAnalytics, getItemCodes, getItemOrders } from "../controllers/analyticsController.js";
const analyticsRouter = express.Router();

analyticsRouter.get("/productTypes", productTypesData);
analyticsRouter.get("/orderAnalytics", getOrderAnalytics);
analyticsRouter.get("/itemcodes",getItemCodes);
analyticsRouter.post("/ordersPerItem",getItemOrders);



export default analyticsRouter;