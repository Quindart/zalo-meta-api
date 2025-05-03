import { UserEntity } from './../entities/user/User.entity';
import { IUserType } from "../entities/user/User.type";
import { IBaseRepository } from "./IBase.repository";

export interface IUserRepository extends IBaseRepository<IUserType, UserEntity> {
    findByEmail(email: string): Promise<any | null>;
    findUserSelect(userId: string, select: string[]): Promise<UserEntity>;
    changePassword(userId: string, password: string, newPassword: string): Promise<boolean>;
    searchUserWithFriends(userId: string, type: string, keywords: string): Promise<UserEntity[]>
}   
