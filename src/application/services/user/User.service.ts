import { UserBuilder } from "../../../domain/entities/user/User.builder.ts";
import { UserEntity } from "../../../domain/entities/user/User.entity.ts";
import { IUserType } from "../../../domain/entities/user/User.type.ts";
import { IUserRepository } from "../../../domain/repositories/IUser.repository.ts";
import { UserDocument } from "../../../infrastructure/mongo/model/User.ts";
import { IUserService } from "../../interfaces/services/IUserService.ts";

class UserService implements IUserService {
    constructor(private userRepository: IUserRepository) { }
   
   
    async findByIdAndUpdateChannel(userId: string, channelId: string): Promise<UserDocument> {
        return await this.userRepository.findByIdAndUpdateChannel(userId, channelId)
    }
    
    toSave(data: UserDocument): Promise<UserDocument> {
        throw new Error("Method not implemented.");
    }

    async create(data: IUserType): Promise<UserDocument> {
        return await this.userRepository.create(data);
    }

    async findOne(id: string): Promise<UserDocument> {
        return await this.userRepository.findOne(id);
    }

    async findAll(queries?: string): Promise<UserDocument[]> {
        return await this.userRepository.findAll(queries);
    }

    async update(id: string, data: IUserType): Promise<UserDocument> {
        return await this.userRepository.update(id, data);
    }

    async delete(id: string): Promise<boolean> {
        return await this.userRepository.delete(id);
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
        return await this.userRepository.create(user);
    }

    async findByEmail(email: string): Promise<UserDocument> {
        return await this.userRepository.findByEmail(email);
    }

    async findByPhone(phone: string, queries: string): Promise<UserDocument> {
        return await this.userRepository.findByPhone(phone, queries);
    }

    async findUserSelect(id: string, queries: string): Promise<UserDocument> {
        return await this.userRepository.findUserSelect(id, queries);
    }

    async changePassword(userId: string, password: string, newPassword: string): Promise<boolean> {
        const user = await this.userRepository.findOne(userId);
        // if (!user) {
        //     throw new Error("User not found");
        // }
        // if (user.password !== password) {
        //     throw new Error("Current password is incorrect");
        // }
        // user.password = newPassword;
        // await this.userRepository.update(userId, user);
        // return true;
        return true;
    }

    async searchUserWithFriends(id: string, type: string, keywords: string): Promise<UserDocument[]> {
        return await this.userRepository.searchUserWithFriends(id, type, keywords);
    }

    async searchUsers(type: string, keywords: string): Promise<any> {
        return await this.userRepository.searchUsers(type, keywords);
    }

    // TODO: ME
    async getMe(userRequest: string, queries: string[]): Promise<any> {
        return await this.userRepository.getMe(userRequest, queries);
    }

    async updateMe(
        userId: string,
        firstName: string,
        lastName: string,
        dateOfBirth: string,
        file?: any
    ): Promise<any> {
        return await this.userRepository.updateMe(userId, firstName, lastName, dateOfBirth, file);
    }

    // TODO: AUTH
    async registerFcmToken(fcmToken: string, userId: string): Promise<void> {
        return await this.userRepository.registerFcmToken(fcmToken, userId);
    }

    async login(phone: string, password: string): Promise<any> {
        return await this.userRepository.login(phone, password);
    }

    async register(
        email: string,
        password: string,
        phone: string,
        firstName: string,
        lastName: string,
        dateOfBirth: string | Date
    ): Promise<any> {
        return await this.userRepository.register(email, password, phone, firstName, lastName, dateOfBirth);
    }

    async refreshToken(refreshToken: string): Promise<any> {
        return await this.userRepository.refreshToken(refreshToken);
    }

    async logout(refreshToken: string): Promise<any> {
        return await this.userRepository.logout(refreshToken);
    }

    async forgotPassword(email: string): Promise<any> {
        return await this.userRepository.forgotPassword(email);
    }

    async verifyForgotPassword(email: string, otp: string | number): Promise<any> {
        return await this.userRepository.verifyForgotPassword(email, otp);
    }

    async resetPassword(email: string, password: string, resetToken: string): Promise<void> {
        return await this.userRepository.resetPassword(email, password, resetToken);
    }
}

export default UserService;
