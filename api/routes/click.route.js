// /api/routes/click.route.js
import express from 'express';
import { createClick } from '../controllers/click.controllers.js';

const router = express.Router();

router.post('/createClick', createClick);


export default router;