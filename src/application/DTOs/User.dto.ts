import { Expose } from "class-transformer";

export class UserDTO {
    @Expose() email: string;
    @Expose() password: string;
    @Expose() avatar?: string;
    @Expose() phone?: string;
    @Expose() gender?: string;
    @Expose() dateOfBirth?: Date;
    @Expose() firstName: string;
    @Expose() lastName: string;
    @Expose() status?: 'ACTIVE' | 'UNACTIVE';
    @Expose() twoFactorAuthenticationSecret?: string;
    @Expose() isTwoFactorAuthenticationEnabled?: boolean;
    @Expose() updatedAt?: Date;
    @Expose() createdAt?: Date;
    @Expose() isVerifiedMail?: boolean;
    @Expose() isEmailNotificationEnabled?: boolean;
    @Expose() emailSentAt?: Date;
    @Expose() channels?: string[];
}
