import { UserEntity } from "../../../domain/entities/user/User.entity";
import { UserDocument } from "../model/User";
export declare class UserMapper {
    static UserMapper(doc: UserDocument): UserDocument | PromiseLike<UserDocument>;
    static toDomain(doc: UserDocument): UserEntity;
    static toPersistence(user: UserEntity): Partial<UserDocument>;
}
