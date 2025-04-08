import { addGalleryItem, deleteGalleryItem, getGalleryItems, updateGalleryItem } from "../controllers/galleryController.js";
import express from 'express'
const galleryRouter = express.Router();
galleryRouter.post("/", addGalleryItem);
galleryRouter.get("/", getGalleryItems);
galleryRouter.delete("/:id",deleteGalleryItem);
galleryRouter.put("/:id",updateGalleryItem);
export default galleryRouter;

