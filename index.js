import mongoose from 'mongoose';
import dotenv from "dotenv";
import app from './app.js';

dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL)
    .then(() => console.log("✅ MongoDB Connection Established Successfully"))
    .catch((error) => console.error("❌ MongoDB Connection Failed:", error));

const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});

process.on('SIGTERM', () => {
    server.close(() => {
        mongoose.connection.close().then(() => process.exit(0));
    });
});
