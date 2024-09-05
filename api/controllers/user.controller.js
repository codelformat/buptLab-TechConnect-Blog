// /api/controllers/user.controller.js
import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import e from 'express';

export const test = (req, res) => {
    res.json({ message: 'API working!' });
};
//更新控制器
export const updateUser = async (req, res, next) => {
    //判断是不是该用户发出的请求
    if (req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to update this user'));
    }
    if (req.body.password) {
        if (req.body.password.length < 6) {
            return next(errorHandler(400, 'Password must be at least 6 characters'));
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }


    if (req.body.username) {
        if (req.body.username.length < 7 || req.body.username.length > 20) {
            return next(errorHandler(400, 'Username must be between 7 and 20 characters'));
        }
        if (req.body.username.includes(' ')) {
            return next(errorHandler(400, 'Username must not contain spaces'));
        }
        if (req.body.username !== req.body.username.toLowerCase()) {
            return next(errorHandler(400, 'Username must be lowercase'));
        }
        if (!req.body.username.match(/^[a-zA-Z0-9]+$/) && !req.body.username.match(/^[\u4e00-\u9fa5]+$/)) {
            return next(errorHandler(400, 'Username must contain only (Chinese) letters and numbers'));
        }
    }
    try {
        //更新数据库
        const updateUser = await User.findByIdAndUpdate(req.params.userId, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                profilePicture: req.body.profilePicture,
                password: req.body.password,
            },
        }, { new: true });
        //解构 不返回password
        const { password, ...rest } = updateUser._doc;
        res.status(200).json(rest);
    }
    catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    console.log(req.user.id.trim());
    console.log(req.params.userId.trim());

    if (!req.user.isAdmin&&req.user.id.trim() !== req.params.userId.trim()) {
        return next(errorHandler(403, 'You are not allowed to delete this user'));
    }
    try {
        await User.findByIdAndDelete(req.params.userId.trim());
        res.status(200).json({ message: 'User has been deleted' });
    } catch (error) {
        next(error); // handle error with middleware
    }
};

export const signout = (req, res) => {
    try {
        res
            .clearCookie('access_token')
            .status(200)
            .json({ message: 'Signout successful' });
        
    }catch(error){
        next(error);
    }
};

export const getUsers = async (req, res, next) => {
    // if(!req.user.isAdmin){
    //     return next(errorHandler(403, 'You are not allowed to get all users'));
    // }
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sortDirection === 'asc' ? 1 : -1;
        console.log(`getting user for id ${req.query.userId}...`)
        const users = await User.find({
            ...(req.query && req.query.userId && {_id: req.query.userId})
        })
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const usersWithoutPassword = users.map((user) => {
            const { password, ...rest } = user._doc;
            return rest;
        });

        
        const totalUsers = await User.countDocuments();
        
        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        console.log(oneMonthAgo);
        // Find users created in the last month
        const lastMonthUsers = await User.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });

        res.status(200).json({
            users: usersWithoutPassword,
            totalUsers,
            lastMonthUsers,
        });

    } catch (error) {
        next(error);
    }
};

//Add from Post part.
export const getUser = async (req,res,next) => {
    try {
        const user = await User.findById(req.params.userId);
        console.log('f getUser', user);
        if (!user) {
            
            return next(errorHandler(404, 'User not found'));
        }
        const { password, ...rest } = user._doc;
        res.status(200).json(rest);
    }
    catch (error) {
        next(error);
    }
}



