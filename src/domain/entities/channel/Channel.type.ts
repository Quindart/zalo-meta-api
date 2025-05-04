import { ROLE_TYPES } from '../../../types/enum/channel.enum';
export interface IMember {
    user: string;
    role: ROLE_TYPES;
}
export interface IDeletedForUser {
    user: string;
}
export interface IChannelType {
    _id: string,
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