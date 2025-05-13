import { injectable } from 'inversify';
import { UserEntity } from '../../../domain/entities/user/User.entity';
import { IUserType } from '../../../domain/entities/user/User.type';
import { IUserRepository } from '../../../domain/repositories/IUser.repository';
import { responseEntity } from '../../../utils/query';
import { UserMapper } from '../mappers/UserMapper';
import User, { UserDocument } from '../model/User';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

@injectable()
export class MongooseUserRepository implements IUserRepository {

    async findByIdAndUpdateChannel(userId: string, channelId: string): Promise<UserDocument> {
        return await User.findByIdAndUpdate(
            userId,
            {
                $addToSet: { channels: channelId },
                updatedAt: Date.now()
            },
            { new: true }
        )
    }
    searchUserWithFriends(userId: string, type: string, keywords: string): Promise<UserDocument[]> {
        throw new Error('Method not implemented.');
    }
    searchUsers(type: string, keywords: string): Promise<any> {
        throw new Error('Method not implemented.');
    }
    getMe(userRequest: string, queries: string[]): PromiseLike<any> {
        throw new Error('Method not implemented.');
    }
    updateMe(userId: string, firstName: string, lastName: string, dateOfBirth: string, file?: any): PromiseLike<any> {
        throw new Error('Method not implemented.');
    }
    registerFcmToken(fcmToken: string, userId: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    login(phone: string, password: string): Promise<any> {
        throw new Error('Method not implemented.');
    }
    register(email: string, password: string, phone: string, firstName: string, lastName: string, dateOfBirth: string | Date): Promise<any> {
        throw new Error('Method not implemented.');
    }
    refreshToken(refreshToken: string): Promise<any> {
        throw new Error('Method not implemented.');
    }
    logout(refreshToken: string): Promise<any> {
        throw new Error('Method not implemented.');
    }
    forgotPassword(email: string): Promise<any> {
        throw new Error('Method not implemented.');
    }
    verifyForgotPassword(email: string, otp: string | number): PromiseLike<any> {
        throw new Error('Method not implemented.');
    }
    resetPassword(email: string, password: string, resetToken: string): Promise<void> {
        throw new Error('Method not implemented.');
    }


    async findUserSelect(userId: string, queries: string): Promise<UserDocument> {
        const user = await User.findById(userId).select(responseEntity(queries));
        return user
    }


    async changePassword(userId: string, password: string, newPassword: string): Promise<boolean> {

        const user = await User.findById(userId);
        if (!user) return false;

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return false;

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await User.findByIdAndUpdate(userId, {
            password: hashedPassword
        },
            {
                new: true,
            }).select(userId).lean()
        return true;
    }


    async searchByField(field: string, keyword: string, excludeId: string): Promise<any[]> {
        const regex = new RegExp(keyword, 'i');
        const users = await User.find({
            _id: { $ne: excludeId },
            [field]: regex,
        });
        return users;
    }

    async findOne(id: string): Promise<UserDocument> {
        const user = await User.findById(new mongoose.Types.ObjectId(id));
        return user
    }

    async findAll(queries: string): Promise<UserDocument[]> {
        return await User.find().select(responseEntity(queries));
    }

    async update(id: string, data: UserEntity): Promise<UserDocument> {
        const updatedDoc = await User.findByIdAndUpdate(id, UserMapper.toPersistence(data), { new: true });
        return updatedDoc
    }

    async create(user: UserEntity): Promise<UserDocument> {
        const created = new User(UserMapper.toPersistence(user));
        return await created.save();
    }

    async delete(id: string): Promise<boolean> {
        const deleted = await User.findByIdAndDelete(id).lean();
        return !!deleted;
    }

    async findByPhone(phone: string, queries: string): Promise<UserDocument> {
        const doc: UserDocument = await User.findOne({ phone }).select(responseEntity(queries));
        return doc
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        const doc: UserDocument = await User.findOne({ email });
        return doc
    }
}
