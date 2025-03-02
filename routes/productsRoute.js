import express from "express"
import { AddProduct, DeleteProduct, getProduct, GetProducts, UpdateProduct} from "../controllers/productController.js";

const productRoute = express.Router();

productRoute.post("/addProduct",AddProduct);
productRoute.get("/getProducts",GetProducts);
productRoute.put("/:key",UpdateProduct);
productRoute.delete("/:key",DeleteProduct);
productRoute.get("/:key",getProduct);

export default productRoute;