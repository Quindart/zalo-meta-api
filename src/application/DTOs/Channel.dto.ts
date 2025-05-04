import { Expose } from "class-transformer";
import { IDeletedForUser, IMember } from "../../domain/entities/channel/Channel.type";

export class ChannelDTO {
    @Expose() _id: string;
    @Expose() type: 'personal' | 'group';
    @Expose() createdAt: Date;
    @Expose() deletedAt?: Date;
    @Expose() isDeleted: boolean;
    @Expose() name?: string;
    @Expose() updatedAt: Date;
    @Expose() avatar?: string;
    @Expose() description?: string;
    @Expose() lastMessage?: string;
    @Expose() deletedForUsers: IDeletedForUser[];
    @Expose() members: IMember[];
}
