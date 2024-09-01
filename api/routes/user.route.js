import express from 'express';
import {test} from '../controllers/user.controller.js';
import { getUser } from '../controllers/user.controller.js';
const router = express.Router();

router.get('/test', test);
//Add from Post part.
router.get('/:userId', getUser);
export default router;