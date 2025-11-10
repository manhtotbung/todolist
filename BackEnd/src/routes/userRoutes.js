import express from 'express';
import { authme } from '../controller/userController';


const router = express.Router();

router.get("/me", authme);

export default router;