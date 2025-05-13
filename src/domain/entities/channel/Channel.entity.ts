import { Expose } from 'class-transformer';
import { BaseEntity } from "../BaseEntity";
import { IChannelType, IDeletedForUser, IMember } from "./Channel.type";

export class ChannelEntity extends BaseEntity<IChannelType> {
    @Expose() type: 'personal' | 'group';
    @Expose() createdAt: Date;
    @Expose() deletedAt?: Date;
    @Expose() isDeleted: boolean;
    @Expose()  name?: string;
    @Expose() updatedAt: Date;
    @Expose() avatar?: string;
    @Expose() description?: string;
    @Expose() lastMessage?: string;
    @Expose() deletedForUsers: IDeletedForUser[];
    @Expose() members: IMember[];

    constructor(channelData: Partial<IChannelType> = {}) {
        super(channelData)
        this.type = channelData.type || 'personal';
        this.deletedAt = channelData.deletedAt;
        this.isDeleted = channelData.isDeleted ?? false;
        this.name = channelData.name;
        this.avatar = channelData.avatar;
        this.description = channelData.description;
        this.lastMessage = channelData.lastMessage;
        this.deletedForUsers = channelData.deletedForUsers || [];
        this.members = channelData.members || [];
    }
}
