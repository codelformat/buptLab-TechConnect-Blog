// /api/controllers/auth.controller.js
import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    console.log(username, email, password);

    if (!username || !email || !password || username === '' || email === '' || password === '') {
        next(errorHandler(400, 'All fields are required'));
    }

    // Hash the password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
        username,
        email,
        password: hashedPassword,
    });

    try {// Save the user to the database
        await newUser.save();
        res.json('Signup successful');
    } catch (error) {
        // Use the next function to pass the error to the error handling middleware
        next(error);
    }
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password || email === '' || password === '') {
        next(errorHandler(400, 'All fields are required'));
    }

    try {
        const validUser = await User.findOne({
            email,
        });

        // If there is no user with the provided email
        if (!validUser) {
            return next(errorHandler(404, 'User not found'));
        }

        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(400, 'Invalid password'));
        }

        // Create a token if everything is valid
        const token = jwt.sign(
            { id: validUser._id, isAdmin: validUser.isAdmin },
            process.env.JWT_SECRET
        );
        console.log(token);
        // Seperate the password from the rest of the user data
        const { password: pass, ...rest } = validUser._doc;

        res.status(200).cookie('access_token', token, {
            httpOnly: true,
        }).json({ rest });

    } catch (error) {
        next(error);
    }
}

export const google = async (req, res, next) => {
    const { name, email, googlePhotoURL } = req.body;

    if (!name || !email || name === '' || email === '') {
        next(errorHandler(400, 'All fields are required'));
    }

    try {
        // Check if the user already exists
        const user = await User.findOne({ email });

        // If the user does not exist, create a new user
        if (!user) {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

            const newUser = new User({
                username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoURL,
            });
            await newUser.save();
            // Create a token
            const token = jwt.sign({ id: newUser._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = newUser._doc;
            res
                .status(200)
                .cookie('access_token', token, {
                    httpOnly: true,
                })
                .json({ rest });
            console.log(token);
            res.json(newUser);
        } else {
            // If the user already exists, send the user data
            const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
            console.log(token);
            const { password: pass, ...rest } = user._doc;
            res.status(200).cookie('access_token', token, {
                httpOnly: true,
            }).json({ rest });
        }
    } catch (error) {
        next(error);
    }
}

// 忘记密码 - 发送验证码
export const forgotPassword = async (req, res, next) => {
    const { email } = req.body;
    console.log(email);

    if (!email || email === '') {
        return next(errorHandler(400, 'Email is required'));
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        // 生成验证码
        const resetCode = crypto.randomBytes(3).toString('hex').toUpperCase();

        // 将验证码保存到用户数据中，设置其有效期，比如15分钟
        user.resetPasswordCode = resetCode;
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15分钟

        await user.save();

        console.log("initiating email sending");
        // 使用nodemailer发送邮件
        const transporter = nodemailer.createTransport({
            // service: 'Gmail',
            host: "smtp.163.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER, // 你的邮箱
                pass: process.env.EMAIL_PASS, // 你的邮箱密码
            },
            debug:true
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset Code',
            text: `Your password reset code is ${resetCode}`,
        };

        console.log("sending email...");
        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, message: 'Verification code sent to your email.' });
    } catch (error) {
        next(error);
    }
};

// 重置密码
export const resetPassword = async (req, res, next) => {
    const { code, newPassword } = req.body;

    if (!code || !newPassword || newPassword.length < 6) {
        return next(errorHandler(400, 'Invalid code or password.'));
    }

    try {
        // 查找用户
        const user = await User.findOne({
            resetPasswordCode: code.toUpperCase(),
            resetPasswordExpire: { $gt: Date.now() }, // 检查是否过期
        });

        if (!user) {
            return next(errorHandler(400, 'Invalid or expired code.'));
        }

        // 更新密码
        user.password = bcryptjs.hashSync(newPassword, 10);
        user.resetPasswordCode = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({ success: true, message: 'Password reset successful' });
    } catch (error) {
        next(error);
    }
};