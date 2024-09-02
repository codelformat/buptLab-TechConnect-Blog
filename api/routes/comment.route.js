import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { createComment, getComments } from '../controllers/comment.controller.js';

const router = express.Router();

router.post('/create/:postId', verifyToken, createComment);
router.get('/getcomments', verifyToken, getComments);

export default router;