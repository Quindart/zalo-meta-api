import { ROLE_TYPES } from "../../../types/enum/channel.enum";
import { ChannelEntity } from "./Channel.entity";
import { IDeletedForUser, IMember } from "./Channel.type";
export declare class ChannelBuilder {
    private channelData;
    withType(type: 'personal' | 'group'): ChannelBuilder;
    withName(name: string): ChannelBuilder;
    withAvatar(avatar: string): ChannelBuilder;
    withDescription(description: string): ChannelBuilder;
    withLastMessage(lastMessage: string): ChannelBuilder;
    withDeletedForUsers(deletedForUsers: IDeletedForUser[]): ChannelBuilder;
    withMembers(members: IMember[]): ChannelBuilder;
    withMember(userId: string, role?: ROLE_TYPES): ChannelBuilder;
    withCreatedAt(createdAt: Date): ChannelBuilder;
    withUpdatedAt(updatedAt: Date): ChannelBuilder;
    withDeletedAt(deletedAt: Date): ChannelBuilder;
    withIsDeleted(isDeleted: boolean): ChannelBuilder;
    withId(id: string): ChannelBuilder;
    build(): ChannelEntity;
}
