import { IBaseRepository } from './IBase.repository.ts';
import { IChannelType, IMember } from "../entities/channel/Channel.type.ts";
import { ChannelDocument } from '../../infrastructure/mongo/model/Channel.ts';

export interface IChannelRepository extends IBaseRepository<IChannelType, ChannelDocument> {

    //TODO: new code
    toSave(document: ChannelDocument): Promise<ChannelDocument>
    findChannelByTypeAndByMemberIds(type: 'personal' | 'group', memberId: string, creatorChannelId: string): Promise<ChannelDocument>
    findChannelsByUserId: (userId: string) => Promise<ChannelDocument[]>;
    findOrCreateChannelPersonal: (memberRequestId: string, userCreateId: string, nameChannel: string, typeChannel: string, avatarChannel: string) => Promise<ChannelDocument>;
    findChannelByIdAndByUserId: (channelId: string, currentUserId?: string) => Promise<ChannelDocument>;
    createChannelGroup(name: string, membersList: IMember[]): Promise<ChannelDocument>;

    updateUserChannelSocket: (channel: any) => Promise<void>;
    updateLastMessageSocket: (channelId: string, lastMessageId: string) => Promise<ChannelDocument>;
    assignRoleChannelIdSocket: (channelId: string, members: IMember[]) => Promise<ChannelDocument>;
    //TODO: member
    removeMemberSocket: (channelId: string, senderId: string, userId: string) => Promise<ChannelDocument>;
    addMemberToChannelSocket: (channelId: string, userId: string) => Promise<ChannelDocument>;
    leaveChannelSocket: (channelId: string, userId: string) => Promise<ChannelDocument>;
    dissolveGroupSocket: (channelId: string, userId: string) => Promise<ChannelDocument>;
}

