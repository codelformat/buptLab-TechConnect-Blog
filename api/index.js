// /api/index.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';  // 新增Websocket
import userRoutes from './routes/user.route.js';  // Import user routes
import authRoutes from './routes/auth.route.js';  // Import auth routes
import postRoutes from './routes/post.route.js';  // Import post routes
import commentRoutes from './routes/comment.route.js';  // Import comment routes
import clickRoutes from './routes/click.route.js';
import notificationRoutes from './routes/notification.route.js';
import cookieParser from 'cookie-parser';
import mdFileRoutes from './routes/mdFile.route.js'
import { connectQueue, closeQueue } from './utils/queue.js';

dotenv.config();

mongoose
    .connect(process.env.MONGO)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.log('Failed to connect to MongoDB', err);
    });

const app = express();
app.use(cookieParser());
// Allow Express to parse JSON and extended URL encoded data into req.body
app.use(express.json());

connectQueue();  // 连接消息队列

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});


app.use('/api/user', userRoutes);  // Use user routes
app.use('/api/auth', authRoutes);  // Use auth routes
app.use('/api/post', postRoutes);  // Use post routes
app.use('/api/comment', commentRoutes);  // Use comment routes
app.use('/api/click', clickRoutes);
app.use('/api/notifications', notificationRoutes);

app.use('/api/upload', mdFileRoutes);
// Middleware to handle errors

// 关闭消息队列连接
process.on('exit', closeQueue);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json(
        {
            success: false,
            statusCode,
            message,
        },
    );
});