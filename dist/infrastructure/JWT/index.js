"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQRToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
exports.generatePasswordTimer = generatePasswordTimer;
exports.verifyTokenPasswordTimer = verifyTokenPasswordTimer;
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
exports.signatureToken = signatureToken;
exports.randomTokenString = randomTokenString;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const crypto_1 = __importDefault(require("crypto"));
dotenv_1.default.config();
function generatePasswordTimer(payload) {
    const key = process.env.TOKEN_PASS_REFRESH_MAIL_KEY;
    const timer = 300; // seconds = 5 minutes
    return jsonwebtoken_1.default.sign({ data: payload }, key, { expiresIn: timer });
}
function verifyTokenPasswordTimer(token) {
    const key = process.env.TOKEN_PASS_REFRESH_MAIL_KEY;
    try {
        return { payload: jsonwebtoken_1.default.verify(token, key), expired: false };
    }
    catch (error) {
        if (error.name === "TokenExpiredError") {
            return { payload: jsonwebtoken_1.default.decode(token), expired: true };
        }
        throw error;
    }
}
function generateToken(type = "access", payload, tokenLife) {
    const key = type === "access"
        ? process.env.TOKEN_SECRET_KEY
        : process.env.REFRESH_TOKEN_SECRET_KEY;
    if (!key) {
        throw new Error("Missing JWT secret key");
    }
    const options = {
        expiresIn: typeof tokenLife === "string" ? parseInt(tokenLife, 10) : tokenLife
    };
    return jsonwebtoken_1.default.sign({ data: payload }, key, options);
}
function verifyToken(type = "access", token) {
    const key = type === "access"
        ? process.env.TOKEN_SECRET_KEY
        : process.env.REFRESH_TOKEN_SECRET_KEY;
    try {
        return { payload: jsonwebtoken_1.default.verify(token, key), expired: false };
    }
    catch (error) {
        if (error.name === "TokenExpiredError") {
            return { payload: jsonwebtoken_1.default.decode(token), expired: true };
        }
        throw error;
    }
}
function signatureToken(token) {
    return token.split(".")[2];
}
function randomTokenString() {
    return crypto_1.default.randomBytes(40).toString("hex");
}
const generateAccessToken = (user) => {
    return jsonwebtoken_1.default.sign(user, process.env.TOKEN_SECRET_KEY, { expiresIn: user.expiry_accesstoken });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (user) => {
    return jsonwebtoken_1.default.sign(user, process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: user.expiry_refreshtoken });
};
exports.generateRefreshToken = generateRefreshToken;
const generateQRToken = (desktopInfo) => {
    return jsonwebtoken_1.default.sign(desktopInfo, process.env.TOKEN_SECRET_KEY, {
        expiresIn: typeof desktopInfo.expiryTimes === "string"
            ? parseInt(desktopInfo.expiryTimes, 10)
            : desktopInfo.expiryTimes
    });
};
exports.generateQRToken = generateQRToken;
// === Export default all ===
exports.default = {
    verifyToken,
    generateToken,
    generateAccessToken: exports.generateAccessToken,
    generateRefreshToken: exports.generateRefreshToken,
    generateQRToken: exports.generateQRToken,
    randomTokenString,
    signatureToken,
    generatePasswordTimer,
    verifyTokenPasswordTimer
};
