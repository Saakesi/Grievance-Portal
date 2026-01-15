import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import connectToMongoDB from "./config/db.js";
import listEndpoints from "express-list-endpoints";
import issueRoutes from "./routes/issueRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";


//saakshimatale_db_user
//g6UHqAY1papAp5au
dotenv.config();
const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/admin", adminRoutes);



console.log(listEndpoints(app));

connectToMongoDB();
const PORT = process.env.PORT
app.listen(PORT, () => console.log("🚀 Server running on port 5000"));
