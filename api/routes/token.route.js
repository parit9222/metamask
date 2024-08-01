import express from 'express';
import { insertData } from '../controllers/token.controller.js';

const router = express.Router();

router.post('/token', insertData);

export default router;
