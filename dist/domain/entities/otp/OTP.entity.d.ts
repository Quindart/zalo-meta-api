import { BaseEntity, IBaseEntityType } from "../BaseEntity";
import { IOTPType } from "./OTP.type";
export declare class OTPEntity extends BaseEntity<IOTPType & IBaseEntityType> {
    email: string;
    otp: string;
    createdAt: Date;
    isVerified: boolean;
    verificationAttempts: number;
    lastAttemptAt?: Date;
    constructor(otpData?: Partial<IOTPType>);
}
