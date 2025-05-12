
import { IChannelType, IMember } from "../../../domain/entities/channel/Channel.type";


export interface IChannelService {
    findOne(id: string, queries?: string): Promise<any>;
    createChannel(
        memberRequestId: string,
        userCreateId: string,
        nameChannel: string,
        typeChannel: IChannelType,
        avatarChannel: string
    ): Promise<any>;

    createChannelSocket(name: string, userId: string, members: string[]): Promise<any>;

    findOrCreateChannelPersonal(
        memberRequestId: string,
        userCreateId: string,
        nameChannel: string,
        typeChannel: 'personal' | 'group',
        avatarChannel: string
    ): Promise<any>;

    findChannelByIdAndByUserId(
        channelId: string,
        currentUserId?: string
    ): Promise<any>;

    createChannelGroup(
        name: string,
        userId: string,
        memberIds: string[]
    ): Promise<void>;

    getChannel(channelId: string, currentUserId?: string): Promise<any>;
    getChannels(currentUserId: string): Promise<any>;

    findChannelsByUserId: (userId: string) => Promise<any[]>;
    findChannelByIdAndByUserId: (channelId: string, currentUserId?: string) => Promise<any>;
    createChannelGroup(name: string, userId: string, membersList: string[]): Promise<any>;

    getChannel(channelId: string, currentUserId?: string): Promise<any>;
    getChannels(currentUserId: string): Promise<any>;
    updateUserChannel: (channel: any) => Promise<void>;
    updateLastMessage: (channelId: string, lastMessageId: string) => Promise<any>;
    assignRoleChannelId: (channelId: string, members: IMember[]) => Promise<any>;
    //TODO: member
    removeMember: (channelId: string, senderId: string, userId: string) => Promise<any>;
    addMemberToChannel: (channelId: string, userId: string) => Promise<any>;
    leaveChannel: (channelId: string, userId: string) => Promise<any>;
    dissolveGroup: (channelId: string, userId: string) => Promise<any>;
}
