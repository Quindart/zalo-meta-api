"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.whitelistMiddleware = exports.blacklistMiddleware = void 0;
const index_1 = require("../constants/index");
const blacklist_1 = __importDefault(require("./blacklist"));
const whitelist_1 = __importDefault(require("./whitelist"));
const blacklistMiddleware = (req, res, next) => {
    const clientIP = req.ip;
    const route = req.path;
    if (blacklist_1.default.isIPBlocked(clientIP)) {
        res.status(index_1.HTTP_STATUS.FORBIDDEN).json({ error: 'IP address is blocked' });
        return;
    }
    if (blacklist_1.default.isRouteBlocked(route)) {
        res.status(index_1.HTTP_STATUS.FORBIDDEN).json({ error: 'Route is blocked' });
        return;
    }
    next();
};
exports.blacklistMiddleware = blacklistMiddleware;
const whitelistMiddleware = (req, res, next) => {
    const clientIP = req.ip;
    const route = req.path;
    if (!whitelist_1.default.isIPAllowed(clientIP)) {
        res.status(index_1.HTTP_STATUS.FORBIDDEN).json({ error: 'IP address is not allowed' });
        return;
    }
    if (!whitelist_1.default.isRouteAllowed(route)) {
        res.status(index_1.HTTP_STATUS.FORBIDDEN).json({ error: 'Route is not allowed' });
        return;
    }
    next();
};
exports.whitelistMiddleware = whitelistMiddleware;
