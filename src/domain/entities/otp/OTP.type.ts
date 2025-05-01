export interface IOTPType {
    email: string;
    otp: string;
    createdAt?: Date;
    isVerified?: boolean;
    verificationAttempts?: number;
    lastAttemptAt?: Date;
}
