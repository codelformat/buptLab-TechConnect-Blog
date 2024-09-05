// /api/controllers/comment.controller.js
import { errorHandler } from "../utils/error.js";
import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";

export const createComment = async (req, res) => {
    //console.log('createComment');
    try {
        const {content ,postId, userId } = req.body;
        //console.log(req);
        if (userId !== req.user.id) {
            return res.status(403).json({ message: 'You are not allowed to create comment for this user' });
        }

        /// Create Notification
        // 找到评论的post
        const commentedPost = await Post.findById(postId);

        // 创建通知内容
        const message = `You have received a comment from user ${userId} on your post "${commentedPost.title}"`

        // 为目标用户创建Notification
        const notification = new Notification({
            userId: commentedPost.userId,
            message,
        })

        // 保存通知
        await notification.save();

        /// Create Comments
        // 创建新评论
        const newComment = new Comment({
            content,
            postId,
            userId,
        });

        // 保存评论
        await newComment.save();

        // 返回json
        res.status(200).json(newComment);
    } catch(error) {

    }
};

export const getComments = async (req, res) => {
    // console.log(req.user);
    // const {user} = req.body;
    // if (!req.user.isAdmin && (req.params.userId || req.params.userId !== user.id)) {
    //     next(errorHandler(403, 'You are not allowed to get all comments'));
    // }
    try {
        console.log("getting comments")
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'desc' ? -1 : 1;
        console.log("finding comments...")
        const comments = await Comment.find(
            {...(req.query.userId && { userId: req.query.userId }),}
        )
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit);
        const totalComments = await Comment.countDocuments();
        const now = new Date();
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        const lastMonthComments = await Comment.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });
        // console.log(comments);
        res.status(200).json({
            comments,
            totalComments,
            lastMonthComments,
        });
    } catch (error) {
        console.log(error);
    }
};
//import Comment from "../models/comment.model.js";
// import { errorHandler } from "../utils/error.js";
// export const createComment = async (req, res, next) => {
//     try {
//         const { content, postId, userId } = req.body;
//         console.log('req.body', req.body);
//         if (userId !== req.user.id) {
//             console.log(userId, req.user.id);
//             return next(errorHandler(403, 'You are not allowed to create this comment'));
//         }
//         const newComment = new Comment({
//             content, postId, userId,
//         });
//         await newComment.save();
//         res.status(200).json(newComment);
//     }
//     catch (error) {
//         next(error);
//     }
// }
export const getPostComments = async (req, res, next) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId }).sort({createdAt:-1,});
        res.status(200).json(comments);
    }
    catch (error) {
        next(error);
    }
}


export const likeComment = async (req, res, next) => {
    try {
        // 找到目标comment
        const comment = await Comment.findById(req.params.commentId);
        //console.log('req commentId', req.params.commentId);
        if (!comment) {
            return next(errorHandler(404, 'Comment not found'));
        }
        //console.log(req.user);
        const userIndex = comment.likes.indexOf(req.user.id);
        //console.log(req.user.id);
        if (userIndex == -1) {
            comment.numberOfLikes += 1;
            comment.likes.push(req.user.id);
            /// 若有点赞，创建Notification
            const goalUserId = comment.userId;
            const message = `You have received a like for your comment "${comment.content}" on post ${postId}`;

            // 创建Notification
            const notification = new Notification({
                userId: goalUserId,
                message,
            });
            
            // 保存Notification
            await notification.save();
        }
        else {
            comment.numberOfLikes -= 1;
            comment.likes.splice(userIndex, 1);
        }

        // 保存comment
        await comment.save();

        res.status(200).json(comment);
    }
    catch (error) {
        next(error);
    }
  
}

export const editComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return next(errorHandler(404, 'COmment not found'));
        }
        if (comment.userId !== req.user.id && !req.user.isAdmin) {
            return next(errorHandler(403, 'You are not allowed to edit the comment'));
        }
        const editedComment=await Comment.findByIdAndUpdate(req.params.commentId,{content:req.body.content,},{new:true})
        res.status(200).json(editedComment);
    }
    catch (error) {
        next(error);
    }
}
export const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return next(errorHandler(404, 'Comment not found'));
        }
        if (comment.userId !== req.user.id && !req.user.isAdmin) {
            return next(errorHandler(403, 'You are not allowed to delete the comment'));
        }
        await Comment.findByIdAndDelete(req.params.commentId);
        res.status(200).json('Comment has been deleted successfully');

    }
    catch (error) {
        next(error);
    }
}