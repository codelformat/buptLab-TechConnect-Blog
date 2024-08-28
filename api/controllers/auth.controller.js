import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

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
            { id: validUser._id },
            process.env.JWT_SECRET
        );
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
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = newUser._doc;
            res
                .status(200)
                .cookie('access_token', token, {
                    httpOnly: true,
                })
                .json({ rest });
            res.json(newUser);
        } else {
            // If the user already exists, send the user data
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = user._doc;
            res.status(200).cookie('access_token', token, {
                httpOnly: true,
            }).json({ rest });
        }
    } catch (error) {
        next(error);
    }
}