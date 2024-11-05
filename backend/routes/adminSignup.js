import express from 'express';
import { addadmin } from '../controllers/adminControllers.js'; // Use ES module syntax and add .js extension

const router = express.Router();

router.post('/newadmin', addadmin); // new admin is added

export default router;
