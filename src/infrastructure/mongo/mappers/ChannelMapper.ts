import { plainToInstance } from "class-transformer";
import { ChannelEntity } from "../../../domain/entities/channel/Channel.entity.ts";
import { IChannelType } from "../../../domain/entities/channel/Channel.type.ts";
import { ChannelDocument } from "../model/Channel.ts";
import { Types } from "mongoose";

export class ChannelMapper {
    static ChannelMapper(doc: ChannelDocument): ChannelDocument | PromiseLike<ChannelDocument> {
        throw new Error('Method not implemented.');
    }
    toDomain(doc: ChannelDocument): ChannelEntity {
        if (!doc) return null;

        const docConvert: Partial<IChannelType> = {
            _id: doc._id.toString(),
            members: doc.members.map((mem: any) => ({ user: mem.user.toString(), role: mem.role })),
            lastMessage: doc.lastMessage._id.toString()
        }
        const channel = { ...doc.toObject() as Record<string, any>, ...docConvert };
        return plainToInstance(ChannelEntity, channel, { excludeExtraneousValues: true })
    }

    toPersistence(channel: ChannelEntity): any {
        const convertMembers = channel.members.length === 0 ? [] : channel.members.map((mem) => ({
            user: mem.user ? new Types.ObjectId(mem.user) : undefined,
            role: mem.role
        }))
        const convertDeletedForUsers = channel.deletedForUsers.length === 0 ? [] : channel.deletedForUsers.map(mem => ({ user: new Types.ObjectId(mem.user) }))
        return {
            _id: channel._id ? new Types.ObjectId(channel._id) : undefined,
            lastMessage: channel.lastMessage ? new Types.ObjectId(channel.lastMessage) : undefined,
            members: convertMembers,
            avatar: channel.avatar,
            name: channel.name,
            description: channel.description,
            type: channel.type,
            deletedForUsers: convertDeletedForUsers,
            createdAt: channel.createdAt,
            isDeleted: false,
            updatedAt: undefined,
        }
    }
}