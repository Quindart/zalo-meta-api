import { OTPEntity } from "../../../domain/entities/otp/OTP.entity";
import { OTPDocument } from "../model/OTP";
import { Types } from "mongoose";
export declare class OTPMapper {
    toDomain(doc: OTPDocument): OTPEntity;
    toPersistence(otp: OTPEntity): {
        _id: Types.ObjectId;
        email: string;
        otp: string;
        createdAt: Date;
        isVerified: boolean;
        verificationAttempts: number;
        lastAttemptAt?: Date;
    };
}
