export declare class UserDTO {
    email: string;
    password: string;
    avatar?: string;
    phone?: string;
    gender?: string;
    dateOfBirth?: Date;
    firstName: string;
    lastName: string;
    status?: 'ACTIVE' | 'UNACTIVE';
    twoFactorAuthenticationSecret?: string;
    isTwoFactorAuthenticationEnabled?: boolean;
    updatedAt?: Date;
    createdAt?: Date;
    isVerifiedMail?: boolean;
    isEmailNotificationEnabled?: boolean;
    emailSentAt?: Date;
    channels?: string[];
}
