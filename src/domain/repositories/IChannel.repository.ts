import { IBaseRepository } from './IBase.repository';
import { IChannelType, IMember } from "../entities/channel/Channel.type";
import { ChannelDocument } from '../../infrastructure/mongo/model/Channel';

export interface IChannelRepository extends IBaseRepository<IChannelType, ChannelDocument> {

    //TODO: new code
    toSave(document: ChannelDocument): Promise<any>
    findChannelByTypeAndByMemberIds(type: 'personal' | 'group', memberId: string, creatorChannelId: string): Promise<any>
    findChannelsByUserId: (userId: string) => Promise<any[]>;
    findOrCreateChannelPersonal: (memberRequestId: string, userCreateId: string, nameChannel: string, typeChannel: string, avatarChannel: string) => Promise<any>;
    findChannelByIdAndByUserId: (channelId: string, currentUserId?: string) => Promise<any>;

    createChannelGroup(name: string, membersList: IMember[]): Promise<any>;
    createChannelSocket(name: string, userId: string, memberIds: string[]): Promise<any>

    getChannel(channelId: string, currentUserId?: string): Promise<any>;
    getChannels(currentUserId: string): Promise<any>;

    updateUserChannelSocket: (channel: any) => Promise<void>;
    updateLastMessageSocket: (channelId: string, lastMessageId: string) => Promise<any>;

    assignRoleChannelIdSocket: (channelId: string, members: IMember[]) => Promise<any>;
    //TODO: member
    removeMemberSocket: (channelId: string, senderId: string, userId: string) => Promise<any>;
    addMemberToChannelSocket: (channelId: string, userId: string) => Promise<any>;
    leaveChannelSocket: (channelId: string, userId: string) => Promise<any>;
    dissolveGroupSocket: (channelId: string, userId: string) => Promise<any>;
}

