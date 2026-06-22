import express from 'express';
import bodyParser from 'body-parser';
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";

import userRouter from './routes/userRouter.js';
import productRoute from './routes/productsRoute.js';
import reviewRouter from './routes/reviewRoute.js';
import inquiryRouter from './routes/inquiryRoute.js';
import orderRouter from './routes/orderRouter.js';
import galleryRouter from './routes/galleryRoute.js';
import newsLetterRouter from './routes/newsLetterRoute.js';
import analyticsRouter from './routes/analyticsRoute.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const JWT_SECRET = process.env.JWT_SECRET;

app.use((req, res, next) => {
    let token = req.header("Authorization");

    if (token) {
        token = token.replace("Bearer ", "");
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (!err) {
                if (decoded.isblocked) {
                    return res.status(403).json({ message: "User is blocked" });
                }
                req.user = decoded;
                return next();
            }
            return next();
        });
    } else {
        next();
    }
});

app.use("/api/users", userRouter);
app.use("/api/products", productRoute);
app.use("/api/reviews", reviewRouter);
app.use("/api/inquiries", inquiryRouter);
app.use("/api/orders", orderRouter);
app.use("/api/gallery", galleryRouter);
app.use('/api/newsletter', newsLetterRouter);
app.use("/api/analytics", analyticsRouter);

app.get('/healthz', (req, res) => res.status(200).json({ status: 'ok' }));

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

export default app;
