import { UserEntity } from "./User.entity";
import { IUserType } from "./User.type";
export declare class UserBuilder {
    private readonly data;
    setEmail(email: string): this;
    setId(_id: string): this;
    setPassword(password: string): this;
    setFirstName(name: string): this;
    setLastName(name: string): this;
    setAvatar(avatar: string): this;
    setPhone(phone: string): this;
    setGender(gender: string): this;
    setDateOfBirth(dob: Date): this;
    setStatus(status: IUserType['status']): this;
    setChannels(channels: string[]): this;
    setTwoFactorAuth(secret: string, enabled: boolean): this;
    setEmailNotification(enabled: boolean): this;
    setIsVerifiedMail(verified: boolean): this;
    setEmailSentAt(date: Date): this;
    setCreatedAt(date: Date): this;
    setUpdatedAt(date: Date): this;
    build(): UserEntity;
}
