export type IUserStatus = 'ACTIVE' | 'UNACTIVE';

export interface IUserType {
    _id?: string;
    email: string;
    password: string;
    avatar?: string;
    phone?: string;
    gender?: string;
    dateOfBirth?: Date;
    firstName: string;
    lastName: string;
    status?: IUserStatus;
    twoFactorAuthenticationSecret?: string;
    isTwoFactorAuthenticationEnabled?: boolean;
    updatedAt?: Date;
    createdAt?: Date;
    isVerifiedMail?: boolean;
    isEmailNotificationEnabled?: boolean;
    emailSentAt?: Date;
    channels?: string[];
}
