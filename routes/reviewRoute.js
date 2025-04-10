import express from "express";
import { addReview, approveReview, deleteReview, getProductReviews, getReviews } from "../controllers/reviewController.js";

const reviewRouter = express.Router();
reviewRouter.post("/", addReview)

reviewRouter.get("/", getReviews)

reviewRouter.delete("/:email", deleteReview)


reviewRouter.put("/:email", approveReview)

reviewRouter.get("/:itemId", getProductReviews)


export default reviewRouter;