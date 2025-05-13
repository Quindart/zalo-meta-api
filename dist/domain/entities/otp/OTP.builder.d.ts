import { OTPEntity } from "./OTP.entity";
export declare class OtpBuilder {
    private readonly data;
    setEmail(email: string): this;
    setOtp(otp: string): this;
    setCreatedAt(date: Date): this;
    setIsVerified(status: boolean): this;
    setVerificationAttempts(attempts: number): this;
    setLastAttemptAt(date: Date): this;
    build(): OTPEntity;
}
