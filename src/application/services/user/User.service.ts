import { inject, injectable } from "inversify";
import { UserBuilder } from "../../../domain/entities/user/User.builder";
import { UserEntity } from "../../../domain/entities/user/User.entity";
import { IUserType } from "../../../domain/entities/user/User.type";
import { IUserRepository } from "../../../domain/repositories/IUser.repository";
import { UserDocument } from "../../../infrastructure/mongo/model/User";
import { IUserService } from "../../interfaces/services/IUserService";
import TYPES from "../../../infrastructure/inversify/type";
type UserRepositoryType = IUserRepository
@injectable()
class UserService implements IUserService {
    constructor(
        @inject(TYPES.UserRepository) private readonly repository: UserRepositoryType
    ) { }

    async findByIdAndUpdateChannel(userId: string, channelId: string): Promise<UserDocument> {
        return await this.repository.findByIdAndUpdateChannel(userId, channelId)
    }

    toSave(data: UserDocument): Promise<UserDocument> {
        throw new Error("Method not implemented.");
    }

    async create(data: IUserType): Promise<UserDocument> {
        return await this.repository.create(data);
    }

    async findOne(id: string): Promise<UserDocument> {
        return await this.repository.findOne(id);
    }

    async findAll(queries?: string): Promise<UserDocument[]> {
        return await this.repository.findAll(queries);
    }

    async update(id: string, data: IUserType): Promise<UserDocument> {
        return await this.repository.update(id, data);
    }

    async delete(id: string): Promise<boolean> {
        return await this.repository.delete(id);
    }

    async createUser(input: any): Promise<UserDocument> {
        if (!input.name || !input.email) {
            throw new Error("Invalid input");
        }
        const builder = new UserBuilder();
        const user: UserEntity = builder
            .setEmail(input.email)
            .setLastName(input.lastName)
            .setFirstName(input.firstName)
            .build();
        return await this.repository.create(user);
    }

    async findByEmail(email: string): Promise<UserDocument> {
        return await this.repository.findByEmail(email);
    }

    async findByPhone(phone: string, queries: string): Promise<UserDocument> {
        return await this.repository.findByPhone(phone, queries);
    }

    async findUserSelect(id: string, queries: string): Promise<UserDocument> {
        return await this.repository.findUserSelect(id, queries);
    }

    async changePassword(userId: string, password: string, newPassword: string): Promise<boolean> {
     
        return await this.repository.changePassword(userId, password, newPassword);
    }

    async searchUserWithFriends(id: string, type: string, keywords: string): Promise<UserDocument[]> {
        return await this.repository.searchUserWithFriends(id, type, keywords);
    }

    async searchUsers(type: string, keywords: string): Promise<any> {
        return await this.repository.searchUsers(type, keywords);
    }

    // TODO: ME
    async getMe(userRequest: string, queries: string[]): Promise<any> {
        return await this.repository.getMe(userRequest, queries);
    }

    async updateMe(
        userId: string,
        firstName: string,
        lastName: string,
        dateOfBirth: string,
        file?: any
    ): Promise<any> {
        return await this.repository.updateMe(userId, firstName, lastName, dateOfBirth, file);
    }

    // TODO: AUTH
    async registerFcmToken(fcmToken: string, userId: string): Promise<void> {
        return await this.repository.registerFcmToken(fcmToken, userId);
    }

    async login(phone: string, password: string): Promise<any> {
        return await this.repository.login(phone, password);
    }

    async register(
        email: string,
        password: string,
        phone: string,
        firstName: string,
        lastName: string,
        dateOfBirth: string | Date
    ): Promise<any> {
        return await this.repository.register(email, password, phone, firstName, lastName, dateOfBirth);
    }

    async refreshToken(refreshToken: string): Promise<any> {
        return await this.repository.refreshToken(refreshToken);
    }

    async logout(refreshToken: string): Promise<any> {
        return await this.repository.logout(refreshToken);
    }

    async forgotPassword(email: string): Promise<any> {
        return await this.repository.forgotPassword(email);
    }

    async verifyForgotPassword(email: string, otp: string | number): Promise<any> {
        return await this.repository.verifyForgotPassword(email, otp);
    }

    async resetPassword(email: string, password: string, resetToken: string): Promise<void> {
        return await this.repository.resetPassword(email, password, resetToken);
    }
}

export default UserService;
