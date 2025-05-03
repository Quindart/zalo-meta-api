import { UserEntity } from '../../../domain/entities/user/User.entity.ts';
import { IUserType } from '../../../domain/entities/user/User.type.ts';
import { IUserRepository } from '../../../domain/repositories/IUser.Repository.ts';
import { responseEntity } from '../../../utils/query.ts';
import { UserMapper } from '../mappers/UserMapper.ts';
import User, { UserDocument } from '../model/User.ts';

export class MongooseUserRepository implements IUserRepository {

    async findOne(id: string): Promise<UserEntity> {
        const user = await User.findById(id)
        return UserMapper.toDomain(user)
    }

    async findAll(queries: (keyof IUserType)[]): Promise<UserEntity[]> {
        const users = await User.find().select(responseEntity(queries))
        return users.map(user => UserMapper.toDomain(user))
    }

    async update(id: string, data: UserEntity): Promise<UserEntity> {
        const updatedDoc = await User.findByIdAndUpdate(id, UserMapper.toPersistence(data), { new: true });
        return UserMapper.toDomain(updatedDoc);
    }

    async create(user: UserEntity): Promise<UserEntity> {
        const created = new User(UserMapper.toPersistence(user));
        const saved = await created.save();
        return UserMapper.toDomain(saved);
    }

    async delete(id: string): Promise<boolean> {
        const deleted = await User.findByIdAndDelete(id).lean();
        return deleted ? true : false
    }

    async findByPhone(phone: string, queries: (keyof IUserType)[]): Promise<UserEntity> {
        const doc: UserDocument = await User.findOne({ phone }).select(responseEntity(queries))
        return doc ? UserMapper.toDomain(doc) : null;
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        const doc: UserDocument = await User.findOne({ email })
        return doc ? UserMapper.toDomain(doc) : null;
    }


}
