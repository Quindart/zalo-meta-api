import mongoose, { Types } from "mongoose";
import { IOTPType } from "../../../domain/entities/otp/OTP.type";
export interface OTPDocument extends Omit<IOTPType, '_id'>, Document {
    toObject(): unknown;
    _id: Types.ObjectId;
}
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
otpSchema.index({ email: 1, createdAt: -1 });

export default mongoose.model("OTP", otpSchema);