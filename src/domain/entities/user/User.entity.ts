import { Exclude, Expose } from "class-transformer";
import { BaseEntity, IBaseEntityType } from "../BaseEntity";
import { IUserType } from "./User.type";
// "dev": "tsc --noEmit && node --no-warnings=ExperimentalWarning --loader ts-node/esm/transpile-only src/server.ts"
@Exclude()
export class UserEntity extends BaseEntity<IUserType & IBaseEntityType> {
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

    constructor(data: Partial<IUserType> = {}) {
        super(data);
        this._id = data._id;
        this.email = data.email || '';
        this.password = data.password || '';
        this.avatar = data.avatar;
        this.phone = data.phone;
        this.gender = data.gender;
        this.dateOfBirth = data.dateOfBirth;
        this.firstName = data.firstName || '';
        this.lastName = data.lastName || '';
        this.status = data.status || 'ACTIVE';
        this.twoFactorAuthenticationSecret = data.twoFactorAuthenticationSecret;
        this.isTwoFactorAuthenticationEnabled = data.isTwoFactorAuthenticationEnabled ?? false;
        this.updatedAt = data.updatedAt;
        this.createdAt = data.createdAt;
        this.isVerifiedMail = data.isVerifiedMail ?? false;
        this.isEmailNotificationEnabled = data.isEmailNotificationEnabled ?? true;
        this.emailSentAt = data.emailSentAt;
        this.channels = data.channels || [];
    }
}
