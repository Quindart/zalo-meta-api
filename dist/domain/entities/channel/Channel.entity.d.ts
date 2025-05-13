import { BaseEntity } from "../BaseEntity";
import { IChannelType, IDeletedForUser, IMember } from "./Channel.type";
export declare class ChannelEntity extends BaseEntity<IChannelType> {
    type: 'personal' | 'group';
    createdAt: Date;
    deletedAt?: Date;
    isDeleted: boolean;
    name?: string;
    updatedAt: Date;
    avatar?: string;
    description?: string;
    lastMessage?: string;
    deletedForUsers: IDeletedForUser[];
    members: IMember[];
    constructor(channelData?: Partial<IChannelType>);
}
