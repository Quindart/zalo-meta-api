import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { HTTP_STATUS } from '../../constants/index.ts';
import { NextFunction, Request, Response } from 'express';

dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.TOKEN_SECRET_KEY as string;

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Access token required' });
        return;
    }

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    message: 'Token has expired',
                    expired: true
                });
                return;
            }

            res.status(HTTP_STATUS.FORBIDDEN).json({
                message: 'Invalid token',
                expired: false
            });
            return;
        }

        req.user = user;
        next();
    });
};

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction): void => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(HTTP_STATUS.FORBIDDEN).json({ message: 'Requires admin privileges' });
    }
};
