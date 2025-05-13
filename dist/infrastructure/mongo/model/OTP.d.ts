import mongoose, { Types } from "mongoose";
import { IOTPType } from "../../../domain/entities/otp/OTP.type";
export interface OTPDocument extends Omit<IOTPType, '_id'>, Document {
    toObject(): unknown;
    _id: Types.ObjectId;
}
declare const _default: mongoose.Model<{
    email: string;
    createdAt: NativeDate;
    otp: string;
    isVerified: boolean;
    verificationAttempts: number;
    lastAttemptAt?: NativeDate;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    email: string;
    createdAt: NativeDate;
    otp: string;
    isVerified: boolean;
    verificationAttempts: number;
    lastAttemptAt?: NativeDate;
}, {}> & {
    email: string;
    createdAt: NativeDate;
    otp: string;
    isVerified: boolean;
    verificationAttempts: number;
    lastAttemptAt?: NativeDate;
} & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    email: string;
    createdAt: NativeDate;
    otp: string;
    isVerified: boolean;
    verificationAttempts: number;
    lastAttemptAt?: NativeDate;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    email: string;
    createdAt: NativeDate;
    otp: string;
    isVerified: boolean;
    verificationAttempts: number;
    lastAttemptAt?: NativeDate;
}>, {}> & mongoose.FlatRecord<{
    email: string;
    createdAt: NativeDate;
    otp: string;
    isVerified: boolean;
    verificationAttempts: number;
    lastAttemptAt?: NativeDate;
}> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>>;
export default _default;
