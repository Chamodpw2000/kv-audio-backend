import express from "express";
import { addReview, approveReview, deleteReview, getMyReviews, getProductReviews, getReviews, unapproveReview, updateReview } from "../controllers/reviewController.js";

const reviewRouter = express.Router();
reviewRouter.post("/", addReview)

reviewRouter.get("/", getReviews)

reviewRouter.delete("/:_id", deleteReview)

reviewRouter.put('/update/:_id', updateReview)

reviewRouter.get("/get-my-reviews", getMyReviews)

reviewRouter.put("/:_id", approveReview)
reviewRouter.put("/unapprove/:_id", unapproveReview)



reviewRouter.get("/:itemId", getProductReviews)


export default reviewRouter;