import { UserEntity } from '../../../domain/entities/user/User.entity';
import { IUserRepository } from '../../../domain/repositories/IUser.repository';
import { UserDocument } from '../model/User';
export declare class MongooseUserRepository implements IUserRepository {
    findByIdAndUpdateChannel(userId: string, channelId: string): Promise<UserDocument>;
    searchUserWithFriends(userId: string, type: string, keywords: string): Promise<UserDocument[]>;
    searchUsers(type: string, keywords: string): Promise<any>;
    getMe(userRequest: string, queries: string[]): PromiseLike<any>;
    updateMe(userId: string, firstName: string, lastName: string, dateOfBirth: string, file?: any): PromiseLike<any>;
    registerFcmToken(fcmToken: string, userId: string): Promise<void>;
    login(phone: string, password: string): Promise<any>;
    register(email: string, password: string, phone: string, firstName: string, lastName: string, dateOfBirth: string | Date): Promise<any>;
    refreshToken(refreshToken: string): Promise<any>;
    logout(refreshToken: string): Promise<any>;
    forgotPassword(email: string): Promise<any>;
    verifyForgotPassword(email: string, otp: string | number): PromiseLike<any>;
    resetPassword(email: string, password: string, resetToken: string): Promise<void>;
    findUserSelect(userId: string, queries: string): Promise<UserDocument>;
    changePassword(userId: string, password: string, newPassword: string): Promise<boolean>;
    searchByField(field: string, keyword: string, excludeId: string): Promise<any[]>;
    findOne(id: string): Promise<UserDocument>;
    findAll(queries: string): Promise<UserDocument[]>;
    update(id: string, data: UserEntity): Promise<UserDocument>;
    create(user: UserEntity): Promise<UserDocument>;
    delete(id: string): Promise<boolean>;
    findByPhone(phone: string, queries: string): Promise<UserDocument>;
    findByEmail(email: string): Promise<UserDocument | null>;
}
