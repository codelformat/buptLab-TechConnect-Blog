import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';  // Import user routes
import authRoutes from './routes/auth.route.js';  // Import auth routes
import postRoutes from './routes/post.route.js';  // Import post routes
import commentRoutes from './routes/comment.route.js';  // Import comment routes
import cookieParser from 'cookie-parser';
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

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

app.use('/api/user', userRoutes);  // Use user routes
app.use('/api/auth', authRoutes);  // Use auth routes
app.use('/api/post', postRoutes);  // Use post routes
app.use('/api/comment', commentRoutes);  // Use comment routes

// Middleware to handle errors
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