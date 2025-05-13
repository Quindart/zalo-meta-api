import { OTPEntity } from "./OTP.entity";
import { IOTPType } from "./OTP.type";

export class OtpBuilder {
    private readonly data: Partial<IOTPType> = {};

    setEmail(email: string) {
        this.data.email = email;
        return this;
    }

    setOtp(otp: string) {
        this.data.otp = otp;
        return this;
    }

    setCreatedAt(date: Date) {
        this.data.createdAt = date;
        return this;
    }

    setIsVerified(status: boolean) {
        this.data.isVerified = status;
        return this;
    }

    setVerificationAttempts(attempts: number) {
        this.data.verificationAttempts = attempts;
        return this;
    }

    setLastAttemptAt(date: Date) {
        this.data.lastAttemptAt = date;
        return this;
    }

    build(): OTPEntity {
        return new OTPEntity(this.data);
    }
}
