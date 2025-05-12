
import { IUserType } from "../../../domain/entities/user/User.type";
import { UserDocument } from "../../../infrastructure/mongo/model/User";

export interface IUserService {

    //TODO: new
    findByIdAndUpdateChannel(userId: string, channelId: string): Promise<UserDocument>
    toSave(data: UserDocument): Promise<UserDocument>

    create(data: IUserType): Promise<UserDocument>;
    findOne(id: string): Promise<UserDocument>;
    findAll(queries?: string): Promise<UserDocument[]>;
    update(id: string, data: IUserType): Promise<UserDocument>;
    delete(id: string): Promise<boolean>;

    createUser(input: any): Promise<UserDocument>;

    findByEmail(email: string): Promise<UserDocument>;
    findByPhone(phone: string, queries: string): Promise<UserDocument>;
    findUserSelect(id: string, queries: string): Promise<UserDocument>;

    changePassword(userId: string, password: string, newPassword: string): Promise<boolean>;

    searchUserWithFriends(id: string, type: string, keywords: string): Promise<UserDocument[]>;
    searchUsers(type: string, keywords: string): Promise<any>;

    getMe(userRequest: string, queries: string[]): Promise<any>;
    updateMe(
        userId: string,
        firstName: string,
        lastName: string,
        dateOfBirth: string,
        file?: any
    ): Promise<any>;

    registerFcmToken(fcmToken: string, userId: string): Promise<void>;

    login(phone: string, password: string): Promise<any>;
    register(
        email: string,
        password: string,
        phone: string,
        firstName: string,
        lastName: string,
        dateOfBirth: string | Date
    ): Promise<any>;
    refreshToken(refreshToken: string): Promise<any>;
    logout(refreshToken: string): Promise<any>;

    forgotPassword(email: string): Promise<any>;
    verifyForgotPassword(email: string, otp: string | number): Promise<any>;
    resetPassword(email: string, password: string, resetToken: string): Promise<void>;
}
