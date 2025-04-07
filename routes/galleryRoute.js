import { addGalleryItem, getGalleryItems } from "../controllers/galleryController.js";
import express from 'express'
const galleryRouter = express.Router();
galleryRouter.post("/", addGalleryItem);
galleryRouter.get("/", getGalleryItems);
export default galleryRouter;