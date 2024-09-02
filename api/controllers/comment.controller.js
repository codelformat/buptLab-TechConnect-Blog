import { errorHandler } from "../utils/error.js";
import Comment from "../models/comment.model.js";

export const createComment = async (req, res) => {
    try {
        const {content ,postId, userId } = req.body;

        if (userId !== req.user.id) {
            return res.status(403).json({ message: 'You are not allowed to create comment for this user' });
        }

        const newComment = new Comment({
            content,
            postId,
            userId,
        });
        await newComment.save();

        res.status(200).json(newComment);
    } catch(error) {

    }
};

export const getComments = async (req, res) => {
    // console.log(req.user);
    if (!req.user.isAdmin) {
        next(errorHandler(403, 'You are not allowed to get all comments'));
    }
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'desc' ? -1 : 1;
        const comments = await Comment.find()
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit);
        const totalComments = await Comment.countDocuments();
        const now = new Date();
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        const lastMonthComments = await Comment.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });
        res.status(200).json({
            comments,
            totalComments,
            lastMonthComments,
        });
    } catch (error) {
        console.log(error);
    }
};