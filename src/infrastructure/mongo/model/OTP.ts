import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
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

// Tạo index để tìm kiếm nhanh
otpSchema.index({ email: 1, createdAt: -1 });

export default mongoose.model("OTP", otpSchema);