// /api/routes/comment.route.js
import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { createComment, getComments,editComment,getPostComments,likeComment,deleteComment } from '../controllers/comment.controller.js';

const router = express.Router();

router.post('/create/:postId', verifyToken, createComment);
router.get('/getcomments', verifyToken, getComments);

router.post('/create', verifyToken, createComment);
router.get('/getPostComments/:postId', getPostComments);
router.put('/likeComment/:commentId', verifyToken, likeComment);
router.put('/editedComment/:commentId', verifyToken, editComment);
router.delete('/deleteComment/:commentId', verifyToken, deleteComment);
export default router;