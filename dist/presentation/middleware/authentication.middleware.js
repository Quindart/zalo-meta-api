"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeAdmin = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = require("../../constants/index");
dotenv_1.default.config();
const ACCESS_TOKEN_SECRET = process.env.TOKEN_SECRET_KEY;
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(index_1.HTTP_STATUS.UNAUTHORIZED).json({ message: 'Access token required' });
        return;
    }
    jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                res.status(index_1.HTTP_STATUS.UNAUTHORIZED).json({
                    message: 'Token has expired',
                    expired: true
                });
                return;
            }
            res.status(index_1.HTTP_STATUS.FORBIDDEN).json({
                message: 'Invalid token',
                expired: false
            });
            return;
        }
        req.user = user;
        next();
    });
};
exports.authenticateToken = authenticateToken;
const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    }
    else {
        res.status(index_1.HTTP_STATUS.FORBIDDEN).json({ message: 'Requires admin privileges' });
    }
};
exports.authorizeAdmin = authorizeAdmin;
