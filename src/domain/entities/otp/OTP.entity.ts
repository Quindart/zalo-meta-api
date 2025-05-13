import { Expose } from "class-transformer";
import { BaseEntity, IBaseEntityType } from "../BaseEntity";
import { IOTPType } from "./OTP.type";

export class OTPEntity extends BaseEntity<IOTPType & IBaseEntityType> {
    @Expose() email: string;
    @Expose() otp: string;
    @Expose() createdAt: Date;
    @Expose() isVerified: boolean;
    @Expose() verificationAttempts: number;
    @Expose() lastAttemptAt?: Date;

    constructor(otpData: Partial<IOTPType> = {}) {
        super(otpData);
        this.email = otpData.email || "";
        this.otp = otpData.otp || "";
        this.createdAt = otpData.createdAt || new Date();
        this.isVerified = otpData.isVerified ?? false;
        this.verificationAttempts = otpData.verificationAttempts ?? 0;
        this.lastAttemptAt = otpData.lastAttemptAt;
    }
}
