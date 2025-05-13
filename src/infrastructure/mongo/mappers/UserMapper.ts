import { UserEntity } from "../../../domain/entities/user/User.entity";
import { UserDocument } from "../model/User";
import {  plainToInstance } from 'class-transformer';
import { Types } from 'mongoose';

export class UserMapper {
    static UserMapper(doc: UserDocument): UserDocument | PromiseLike<UserDocument> {
        throw new Error('Method not implemented.');
    }
    static toDomain(doc: UserDocument): UserEntity {
        if (!doc) return null;
        const user = { ...doc.toObject() as Record<string, any>, _id: doc._id.toString() };
        return plainToInstance(UserEntity, user, { excludeExtraneousValues: true });
    }

    static toPersistence(user: UserEntity): Partial<UserDocument> {
        return {
            _id: user._id ? new Types.ObjectId(user._id) : undefined, email: user.email,
            password: user.password,
            avatar: user.avatar,
            phone: user.phone,
            gender: user.gender,
            dateOfBirth: user.dateOfBirth,
            firstName: user.firstName,
            lastName: user.lastName,
            status: user.status,
            twoFactorAuthenticationSecret: user.twoFactorAuthenticationSecret,
            isTwoFactorAuthenticationEnabled: user.isTwoFactorAuthenticationEnabled,
            updatedAt: user.updatedAt,
            createdAt: user.createdAt,
            isVerifiedMail: user.isVerifiedMail,
            isEmailNotificationEnabled: user.isEmailNotificationEnabled,
            emailSentAt: user.emailSentAt,
            channels: user.channels,
        };
    }
}
