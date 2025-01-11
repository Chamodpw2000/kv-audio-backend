import express from "express";
import { AddInquiry, DeleteInquiry, GetInquiries, UpdateInquiry } from "../controllers/inquiryController.js";

const inquiryRouter = express.Router();

inquiryRouter.post("/",AddInquiry);
inquiryRouter.get("/",GetInquiries);
inquiryRouter.delete("/:id", DeleteInquiry);
inquiryRouter.put("/:id", UpdateInquiry);


export default inquiryRouter;
