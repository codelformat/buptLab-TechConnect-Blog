// /api/controllers/click.controller.js
import Click from '../models/click.model.js';
import Post from '../models/post.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export const createClick = async (req, res, next) => 
{
    try{
        const { postId, userId } = req.body;
        //查看当前有没有
        const click = await Click.findOne({ postId, userId });
        if(click) return next(errorHandler(403, 'You have already clicked this post'));
        const newClick = new Click({postId, userId});
        await newClick.save();
        await Post.findByIdAndUpdate(postId, {$inc: {clickNum: 1}});
        res.status(200).json(newClick);
    }
    catch(error){
        next(error);
    }
}