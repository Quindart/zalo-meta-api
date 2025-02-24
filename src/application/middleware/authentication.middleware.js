import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.TOKEN_SECRET_KEY;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET_KEY;

let refreshTokens = [];

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

export const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Requires admin privileges' });
    }
};

export const generateAccessToken = (user) => {
    return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: user.expiry_accesstoken });
};

export const generateRefreshToken = (user) => {
    return jwt.sign(user, REFRESH_TOKEN_SECRET, { expiresIn: user.expiry_refreshtoken });
};