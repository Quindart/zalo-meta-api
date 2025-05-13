import { IDeletedForUser, IMember } from "../../domain/entities/channel/Channel.type";
export declare class ChannelDTO {
    _id: string;
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
}
