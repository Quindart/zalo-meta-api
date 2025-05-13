import { ROLE_TYPES } from "../../../types/enum/channel.enum";
import { ChannelEntity } from "./Channel.entity";
import { IChannelType, IDeletedForUser, IMember } from "./Channel.type";

export class ChannelBuilder {
    private channelData: Partial<IChannelType> = {};

    withType(type: 'personal' | 'group'): ChannelBuilder {
        this.channelData.type = type;
        return this;
    }

    withName(name: string): ChannelBuilder {
        this.channelData.name = name;
        return this;
    }

    withAvatar(avatar: string): ChannelBuilder {
        this.channelData.avatar = avatar;
        return this;
    }

    withDescription(description: string): ChannelBuilder {
        this.channelData.description = description;
        return this;
    }

    withLastMessage(lastMessage: string): ChannelBuilder {
        this.channelData.lastMessage = lastMessage;
        return this;
    }

    withDeletedForUsers(deletedForUsers: IDeletedForUser[]): ChannelBuilder {
        this.channelData.deletedForUsers = deletedForUsers;
        return this;
    }

    withMembers(members: IMember[]): ChannelBuilder {
        this.channelData.members = members;
        return this;
    }

    withMember(userId: string, role: ROLE_TYPES = ROLE_TYPES.MEMBER): ChannelBuilder {
        this.channelData.members = this.channelData.members || [];
        this.channelData.members.push({ user: userId, role });
        return this;
    }

    withCreatedAt(createdAt: Date): ChannelBuilder {
        this.channelData.createdAt = createdAt;
        return this;
    }

    withUpdatedAt(updatedAt: Date): ChannelBuilder {
        this.channelData.updatedAt = updatedAt;
        return this;
    }

    withDeletedAt(deletedAt: Date): ChannelBuilder {
        this.channelData.deletedAt = deletedAt;
        return this;
    }

    withIsDeleted(isDeleted: boolean): ChannelBuilder {
        this.channelData.isDeleted = isDeleted;
        return this;
    }

    withId(id: string): ChannelBuilder {
        this.channelData._id = id;
        return this;
    }

    build(): ChannelEntity {
        return ChannelEntity.create(this.channelData);
    }
}