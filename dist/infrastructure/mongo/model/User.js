"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const USER_STATUS = {
    ACTIVE: "ACTIVE",
    UNACTIVE: "UNACTIVE",
};
const UserSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String },
    phone: { type: String, unique: true },
    gender: { type: String },
    dateOfBirth: { type: Date },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    status: { type: String, enum: [USER_STATUS.ACTIVE, USER_STATUS.UNACTIVE] },
    twoFactorAuthenticationSecret: { type: String },
    isTwoFactorAuthenticationEnabled: { type: Boolean, default: false },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    isVerifiedMail: {
        type: Boolean,
        default: false
    },
    isEmailNotificationEnabled: { type: Boolean, default: true },
    emailSentAt: { type: Date },
    channels: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Channel" }]
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("User", UserSchema);
;
