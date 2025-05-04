import { IMember } from "../entities/channel/Channel.type.ts";

export class IChannelRepository {
    findChannelsByUserId: (userId: string) => Promise<any[]>;

    findOrCreateChannelSocket: (memberRequestId: string, userCreateId: string, nameChannel: string, typeChannel: string, avatarChannel: string) => Promise<any>;
    findChannelByIdAndByUserId: (channelId: string, currentUserId?: string) => Promise<any>;


    createChannelSocket: (name: string, userId: string, memberIds: string[]) => Promise<any>;

    updateUserChannelSocket: (channel: any) => Promise<void>;
    updateLastMessageSocket: (channelId: string, lastMessageId: string) => Promise<any>;
    assignRoleChannelIdSocket: (channelId: string, members: IMember[]) => Promise<any>;
    //TODO: member
    removeMemberSocket: (channelId: string, senderId: string, userId: string) => Promise<any>;
    addMemberToChannelSocket: (channelId: string, userId: string) => Promise<any>;
    leaveChannelSocket: (channelId: string, userId: string) => Promise<any>;
    dissolveGroupSocket: (channelId: string, userId: string) => Promise<any>;
}