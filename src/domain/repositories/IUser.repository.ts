import { UserEntity } from './../entities/user/User.entity';
import { IUserType } from "../entities/user/User.type";
import { IBaseRepository } from "./IBase.repository";

export interface IUserRepository extends IBaseRepository<IUserType, UserEntity> {
    findByEmail(email: string): Promise<UserEntity>;
    findByPhone(phone: string, queries: string): Promise<UserEntity>;
    findUserSelect(userId: string, queries: string): Promise<UserEntity>;
    changePassword(userId: string, password: string, newPassword: string): Promise<boolean>;
    searchUserWithFriends(userId: string, type: string, keywords: string): Promise<UserEntity[]>;
    searchUsers(type: string, keywords: string): Promise<any>;


    //TODO: ME
    getMe(userRequest: string, queries: string[]): PromiseLike<any>;
    updateMe(userId: string, firstName: string, lastName: string, dateOfBirth: string, file?: any): PromiseLike<any>;


    //TODO: AUTH
    registerFcmToken(fcmToken: string, userId: string): Promise<void>;
    login(phone: string, password: string): Promise<any>;
    register(
        email: string,
        password: string,
        phone: string,
        firstName: string,
        lastName: string,
        dateOfBirth: string | Date,
    ): Promise<any>;
    refreshToken(refreshToken: string): Promise<any>;
    logout(refreshToken: string): Promise<any>;
    changePassword(phone: string, password: string, newPassword: string): Promise<any>;
    forgotPassword(email: string): Promise<any>;
    verifyForgotPassword(email: string, otp: string | number): PromiseLike<any>
    resetPassword(email: string, password: string, resetToken: string): Promise<void>;

}

