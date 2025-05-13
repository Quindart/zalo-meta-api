import { BaseEntity, IBaseEntityType } from "../BaseEntity";
import { IUserType } from "./User.type";
export declare class UserEntity extends BaseEntity<IUserType & IBaseEntityType> {
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
    constructor(data?: Partial<IUserType>);
}
