"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const otpSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
        index: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationAttempts: {
        type: Number,
        default: 0
    },
    lastAttemptAt: {
        type: Date
    }
});
otpSchema.index({ email: 1, createdAt: -1 });
exports.default = mongoose_1.default.model("OTP", otpSchema);
