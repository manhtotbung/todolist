import express from "express";
import { GetAllTasks, CreateTask, UpdateTask, DeleteTask } from "../controller/TasksController.js";

const router = express.Router();

//read
router.get("/", GetAllTasks);
//post: create
router.post("/", CreateTask);
//put: update
router.put("/:id", UpdateTask);

router.delete("/:id", DeleteTask);

export default router;