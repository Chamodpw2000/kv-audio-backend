import express from 'express';
import { subscribeToNewsletter } from '../controllers/newsLetterController.js';
const newsLetterRouter = express.Router();


newsLetterRouter.post("/subscribe",subscribeToNewsletter)

export default newsLetterRouter;