import { UserEntity } from "./User.entity";
import { IUserType } from "./User.type";

export class UserBuilder {
    private readonly data: Partial<IUserType> = {};

    setEmail(email: string) {
        this.data.email = email;
        return this;
    }
    setId(_id: string) {
        this.data._id = _id;
        return this;
    }

    setPassword(password: string) {
        this.data.password = password;
        return this;
    }

    setFirstName(name: string) {
        this.data.firstName = name;
        return this;
    }

    setLastName(name: string) {
        this.data.lastName = name;
        return this;
    }

    setAvatar(avatar: string) {
        this.data.avatar = avatar;
        return this;
    }

    setPhone(phone: string) {
        this.data.phone = phone;
        return this;
    }

    setGender(gender: string) {
        this.data.gender = gender;
        return this;
    }

    setDateOfBirth(dob: Date) {
        this.data.dateOfBirth = dob;
        return this;
    }

    setStatus(status: IUserType['status']) {
        this.data.status = status;
        return this;
    }

    setChannels(channels: string[]) {
        this.data.channels = channels;
        return this;
    }

    setTwoFactorAuth(secret: string, enabled: boolean) {
        this.data.twoFactorAuthenticationSecret = secret;
        this.data.isTwoFactorAuthenticationEnabled = enabled;
        return this;
    }

    setEmailNotification(enabled: boolean) {
        this.data.isEmailNotificationEnabled = enabled;
        return this;
    }

    setIsVerifiedMail(verified: boolean) {
        this.data.isVerifiedMail = verified;
        return this;
    }

    setEmailSentAt(date: Date) {
        this.data.emailSentAt = date;
        return this;
    }

    setCreatedAt(date: Date) {
        this.data.createdAt = date;
        return this;
    }

    setUpdatedAt(date: Date) {
        this.data.updatedAt = date;
        return this;
    }

    build(): UserEntity {
        return new UserEntity(this.data);
    }
}
