import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { HTTP_STATUS } from '../../constants/index.js';
dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.TOKEN_SECRET_KEY;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET_KEY;

let refreshTokens = [];

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Access token required' });
    }
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    message: 'Token has expired',
                    expired: true
                });
            }
            return res.status(HTTP_STATUS.FORBIDDEN).json({
                message: 'Invalid token',
                expired: false
            });
        }

        req.user = user;
        next();
    });
};

export const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(HTTP_STATUS.FORBIDDEN).json({ message: 'Requires admin privileges' });
    }
};

export const generateAccessToken = (user) => {
    return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: user.expiry_accesstoken });
};

export const generateRefreshToken = (user) => {
    return jwt.sign(user, REFRESH_TOKEN_SECRET, { expiresIn: user.expiry_refreshtoken });
};