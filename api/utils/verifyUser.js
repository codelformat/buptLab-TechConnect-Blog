// /api/utils/verifyUser.js
import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";
export const verifyToken = (req, res, next) => { 
    const token = req.cookies.access_token;
    console.log(token)
    if (!token) {
        //cookie过期后redirect
        res.redirect('/sign-in');
        return next(errorHandler(401,"Unauthorized"));
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            res.redirect('/sign-in');
            return next(errorHandler(401,"Unauthorized"));
        }
        req.user = user;
        next();
    });
}

