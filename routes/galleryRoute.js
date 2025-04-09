import { addGalleryItem, deleteGalleryItem, getGalleryItems, getImagesFromFeedbacks, updateGalleryItem } from "../controllers/galleryController.js";
import express from 'express'
const galleryRouter = express.Router();
galleryRouter.post("/", addGalleryItem);
galleryRouter.get("/", getGalleryItems);
galleryRouter.delete("/:id",deleteGalleryItem);
galleryRouter.put("/:id",updateGalleryItem);
galleryRouter.get("/feedbackImages",getImagesFromFeedbacks);

export default galleryRouter;

