import express from "express"
import { AddProduct } from "../controllers/productController.js";

const productRoute = express.Router();

productRoute.post("/addProduct",AddProduct);

export default productRoute;