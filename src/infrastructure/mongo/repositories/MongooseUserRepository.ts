import { UserEntity } from '../../../domain/entities/user/User.entity.ts';
import { IUserRepository } from '../../../domain/repositories/IUser.repository.ts';
import { responseEntity } from '../../../utils/query.ts';
import { UserMapper } from '../mappers/UserMapper.ts';
import User, { UserDocument } from '../model/User.ts';

export class MongooseUserRepository implements IUserRepository {
    async findUserSelect(userId: string, queries: string): Promise<UserEntity> {
        const user = await User.findById(userId).select(responseEntity(queries));
        return user ? UserMapper.toDomain(user) : null;
    }

    async changePassword(userId: string, password: string, newPassword: string): Promise<boolean> {
        const user = await User.findById(userId);
        if (!user) return false;

        const isMatch = true
        // const isMatch = await user.comparePassword(password); 
        if (!isMatch) return false;

        user.password = newPassword;
        await user.save();
        return true;
    }

    async searchUserWithFriends(userId: string, type: string, keywords: string): Promise<UserEntity[]> {
        const regex = new RegExp(keywords, 'i');
        const users = await User.find({
            _id: { $ne: userId },
            [type]: regex,
        });
        return users.map(user => UserMapper.toDomain(user));
    }

    async findOne(id: string): Promise<UserEntity> {
        const user = await User.findById(id);
        return user ? UserMapper.toDomain(user) : null;
    }

    async findAll(queries: string): Promise<UserEntity[]> {
        const users = await User.find().select(responseEntity(queries));
        return users.map(user => UserMapper.toDomain(user));
    }

    async update(id: string, data: UserEntity): Promise<UserEntity> {
        const updatedDoc = await User.findByIdAndUpdate(id, UserMapper.toPersistence(data), { new: true });
        return updatedDoc ? UserMapper.toDomain(updatedDoc) : null;
    }

    async create(user: UserEntity): Promise<UserEntity> {
        const created = new User(UserMapper.toPersistence(user));
        const saved = await created.save();
        return UserMapper.toDomain(saved);
    }

    async delete(id: string): Promise<boolean> {
        const deleted = await User.findByIdAndDelete(id).lean();
        return !!deleted;
    }

    async findByPhone(phone: string, queries: string): Promise<UserEntity> {
        const doc: UserDocument = await User.findOne({ phone }).select(responseEntity(queries));
        return doc ? UserMapper.toDomain(doc) : null;
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        const doc: UserDocument = await User.findOne({ email });
        return doc ? UserMapper.toDomain(doc) : null;
    }
}
