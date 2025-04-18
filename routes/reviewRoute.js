import express from "express";
import { addReview, approveReview, deleteReview, getMyReviews, getProductReviews, getReviews } from "../controllers/reviewController.js";

const reviewRouter = express.Router();
reviewRouter.post("/", addReview)

reviewRouter.get("/", getReviews)

reviewRouter.delete("/:email", deleteReview)

reviewRouter.get("/get-my-reviews", getMyReviews)

reviewRouter.put("/:email", approveReview)

reviewRouter.get("/:itemId", getProductReviews)


export default reviewRouter;