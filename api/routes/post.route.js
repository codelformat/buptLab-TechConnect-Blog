// /api/routes/post.route.js
import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create, deletepost, getposts, updatepost,
    get_required_post ,getpostBySlug, getPostsCount,getpostsByCategory
} from '../controllers/post.controller.js';

const router = express.Router();

router.post('/create', verifyToken, create)
router.post('/getposts',getposts)
router.delete('/deletepost',deletepost)
router.put('/update-post/:postId',updatepost)
router.post('/get_required_post',get_required_post)
router.post('/getpostBySlug',getpostBySlug)
router.get('/getPostsCount',getPostsCount)
router.post('/getpostsByCategory',getpostsByCategory)

export default router;