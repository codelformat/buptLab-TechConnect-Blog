import User from "../models/user.model";
import { errorHandler } from "../utils/error";

export const test = (req, res) => {
    res.json({ message: 'API working!' });
};

//Add from Post part.
export const getUser = async (req,res,next) => {
    try {
        const user = await User.findById(req, parma.userId);
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