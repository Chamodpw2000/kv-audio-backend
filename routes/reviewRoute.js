import express from "express";
import { addReview, approveReview, deleteReview, getMyReviews, getProductReviews, getReviews, updateReview } from "../controllers/reviewController.js";

const reviewRouter = express.Router();
reviewRouter.post("/", addReview)

reviewRouter.get("/", getReviews)

reviewRouter.delete("/:email", deleteReview)

reviewRouter.put('/update/:_id', updateReview)

reviewRouter.get("/get-my-reviews", getMyReviews)

reviewRouter.put("/:email", approveReview)

reviewRouter.get("/:itemId", getProductReviews)


export default reviewRouter;