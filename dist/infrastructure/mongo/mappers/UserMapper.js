"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMapper = void 0;
const User_entity_1 = require("../../../domain/entities/user/User.entity");
const class_transformer_1 = require("class-transformer");
const mongoose_1 = require("mongoose");
class UserMapper {
    static UserMapper(doc) {
        throw new Error('Method not implemented.');
    }
    static toDomain(doc) {
        if (!doc)
            return null;
        const user = Object.assign(Object.assign({}, doc.toObject()), { _id: doc._id.toString() });
        return (0, class_transformer_1.plainToInstance)(User_entity_1.UserEntity, user, { excludeExtraneousValues: true });
    }
    static toPersistence(user) {
        return {
            _id: user._id ? new mongoose_1.Types.ObjectId(user._id) : undefined, email: user.email,
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
exports.UserMapper = UserMapper;
