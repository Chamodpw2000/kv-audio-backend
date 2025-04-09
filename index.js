import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";

import userRouter from './routes/userRouter.js';
import productRoute from './routes/productsRoute.js';
import reviewRouter from './routes/reviewRoute.js';
import inquiryRouter from './routes/inquiryRoute.js';
import orderRouter from './routes/orderRouter.js';
import galleryRouter from './routes/galleryRoute.js';

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware for authentication
app.use((req, res, next) => {
    let token = req.header("Authorization");

    if (token) {
        token = token.replace("Bearer ", "");
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (!err) {
                req.user = decoded;
            }
        });
    }
    next();
});

// MongoDB Connection
mongoose.connect(MONGO_URL)
    .then(() => console.log("✅ MongoDB Connection Established Successfully"))
    .catch((error) => console.error("❌ MongoDB Connection Failed:", error));


// API Routes
app.use("/api/users", userRouter);
app.use("/api/products", productRoute);
app.use("/api/reviews", reviewRouter);
app.use("/api/inquiries", inquiryRouter);
app.use("/api/orders",orderRouter);
app.use("/api/gallery", galleryRouter);
 

// Test Routes
app.get('/', (req, res) => {
    res.send("Welcome to the KV-Audio Backend");
});

app.post('/', (req, res) => {
    res.json({ message: `Received POST request with data: ${JSON.stringify(req.body)}` });
});

app.delete('/', (req, res) => {
    res.json({ message: "DELETE request received" });
});

app.put('/', (req, res) => {
    res.json({ message: "PUT request received" });
});

// Start Server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
