import express from "express";
import { GetAllTasks, CreateTask, UpdateTask, DeleteTask } from "../controller/TasksController.js";
import { protectedRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Tất cả các route đều cần xác thực
router.get("/", protectedRoute, GetAllTasks);
router.post("/", protectedRoute, CreateTask);
router.put("/:id", protectedRoute, UpdateTask);
router.delete("/:id", protectedRoute, DeleteTask);

export default router;