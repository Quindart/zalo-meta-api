"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpBuilder = void 0;
const OTP_entity_1 = require("./OTP.entity");
class OtpBuilder {
    constructor() {
        this.data = {};
    }
    setEmail(email) {
        this.data.email = email;
        return this;
    }
    setOtp(otp) {
        this.data.otp = otp;
        return this;
    }
    setCreatedAt(date) {
        this.data.createdAt = date;
        return this;
    }
    setIsVerified(status) {
        this.data.isVerified = status;
        return this;
    }
    setVerificationAttempts(attempts) {
        this.data.verificationAttempts = attempts;
        return this;
    }
    setLastAttemptAt(date) {
        this.data.lastAttemptAt = date;
        return this;
    }
    build() {
        return new OTP_entity_1.OTPEntity(this.data);
    }
}
exports.OtpBuilder = OtpBuilder;
