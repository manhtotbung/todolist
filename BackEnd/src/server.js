import express from "express";
import TaskRoutes from './routes/TasksRoutes.js';
import { connectDB } from "./config/db.js";
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

app.use(express.json());

if(process.env.NODE_ENV !== "production")
{
    app.use(cors({ origin:"http://localhost:5173" })); 
}

app.use("/api/tasks", TaskRoutes);

if(process.env.NODE_ENV === "production")
{
    //yeu cau express lay toan bo file trong dist tinh nhu la css, html, js va gui cho nguowi dung khi ho truy cap 
    app.use(express.static(path.join(__dirname, "../FrontEnd/dist")));
    app.get("*", (req,res)=>{
    res.sendFile(path.join(__dirname,"../FrontEnd/dist/index.html"));
});
}

connectDB().then(()=>{
    app.listen(PORT,() =>{
        console.log(`sever bắt đầu trên cổng ${PORT}`);
    });
});
