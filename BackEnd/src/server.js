import express from "express";
import TaskRoutes from './routes/TasksRoutes.js';
import { connectDB } from "./config/db.js";
import dotenv from 'dotenv';
import cors from 'cors'


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cors({ origin:"http://localhost:5173" }));

app.use("/api/tasks", TaskRoutes);

connectDB().then(()=>{
    app.listen(PORT,() =>{
        console.log(`sever bắt đầu trên cổng ${PORT}`);
    });
});
