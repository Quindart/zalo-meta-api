import { UserEntity } from '../../../domain/entities/user/User.entity.ts';
import { IUserRepository } from '../../../domain/repositories/IUserRepository.ts';
import { UserMapper } from '../mappers/UserMapper.ts';
import User, { UserDocument } from '../model/User.ts';

export class MongooseUserRepository implements IUserRepository {

    async findByEmail(email: string): Promise<UserEntity | null> {
        const doc: UserDocument = await User.findOne({ email })
        return doc ? UserMapper.toDomain(doc) : null;
    }

    async create(user: UserEntity): Promise<UserEntity> {
        const created = new User(UserMapper.toPersistence(user));
        const saved = await created.save();
        return UserMapper.toDomain(saved);
    }
}
