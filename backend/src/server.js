import express from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';

import TaskRoutes from './routes/TasksRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoute from './routes/userRoutes.js';
import { connectDB } from "./config/db.js";
import { protectedRoute } from "./middlewares/authMiddleware.js";



dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

//middleware
app.use(express.json());
app.use(cookieParser());


if(process.env.NODE_ENV !== "production") {
    app.use(cors({ 
        origin: ["http://localhost:5173", "http://localhost:5174"],
        credentials: true
    })); 
} else {
    app.use(cors({
        origin: ["https://todolist-aecd.onrender.com"],
        credentials: true
    }));
}

//public route
app.use("/api/tasks", TaskRoutes);
app.use("/api/auth", authRoutes);

//private route
app.use(protectedRoute);
app.use("/api/users", userRoute);

if(process.env.NODE_ENV === "production")
{
    //yeu cau express lay toan bo file trong dist tinh nhu la css, html, js va gui cho nguowi dung khi ho truy cap 
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("*", (req,res)=>{
    res.sendFile(path.join(__dirname,"../frontend/dist/index.html"));
});
}

connectDB().then(()=>{
    app.listen(PORT,() =>{
        console.log(`sever bắt đầu trên cổng ${PORT}`);
    });
});
