import { IChannelType, IMember } from "../../../domain/entities/channel/Channel.type";
import { ROLE_TYPES } from "../../../types/enum/channel.enum";
import { ChannelDocument } from "../model/Channel";
import { IChannelRepository } from "../../../domain/repositories/IChannel.repository";
import { ILogger } from "../../logger/WinstonLogger";
type LoggerType = ILogger;
export interface IChannelCreateData extends Partial<IChannelType> {
    memberRequestId: string;
    userCreateId: string;
    nameChannel: string;
    typeChannel: string;
    avatarChannel: string;
}
export declare class MongooseChannelRepository implements IChannelRepository {
    private readonly logger;
    private _baseRepository;
    constructor(logger: LoggerType);
    toSave(document: ChannelDocument): Promise<any>;
    create(data: IChannelCreateData): Promise<ChannelDocument>;
    createChannelGroup(name: string, membersList: IMember[]): Promise<ChannelDocument>;
    getChannel(channelId: string, currentUserId?: string): Promise<{
        id: any;
        name: any;
        avatar: any;
        avatarGroup: any;
        type: any;
        members: any;
        time: any;
        message: any;
        deletedForUsers: any;
        isDeleted: any;
    }>;
    getChannels(currentUserId: string): Promise<{
        id: any;
        name: any;
        avatar: any;
        avatarGroup: any;
        type: any;
        members: any;
        time: any;
        message: any;
        deletedForUsers: any;
        isDeleted: any;
    }[]>;
    findOne(id: string, queries?: string): Promise<ChannelDocument>;
    findChannelByTypeAndByMemberIds(type: 'personal' | 'group', memberId: string, creatorChannelId: string): Promise<ChannelDocument>;
    findAll(queries?: string): Promise<ChannelDocument[]>;
    update(id: string, data: IChannelType): Promise<ChannelDocument>;
    delete(id: string): Promise<boolean>;
    findOrCreateChannelPersonal(memberRequestId: string, userCreateId: string, nameChannel: string, typeChannel: string, avatarChannel: string): Promise<{
        id: any;
        name: any;
        avatar: any;
        avatarGroup: any;
        type: any;
        members: any;
        time: any;
        message: any;
        deletedForUsers: any;
        isDeleted: any;
    }>;
    findChannelByIdAndByUserId(channelId: string, currentUserId?: string): Promise<any>;
    createChannelSocket(name: string, currentUserId: string, members: string[]): Promise<{
        id: string;
        name: string;
        avatar: string;
        type: "personal" | "group";
        members: {
            userId: string;
            role: ROLE_TYPES;
        }[];
        time: Date;
        message: string;
    }>;
    updateUserChannelSocket(channel: any): Promise<void>;
    assignRoleChannelIdSocket(channelId: string, updatedMembers: any): Promise<void>;
    updateLastMessageSocket(channelId: string, lastMessageId: string): Promise<any>;
    removeMemberSocket(channelId: string, senderId: string, userId: string): Promise<any>;
    addMemberToChannelSocket(channelId: string, userId: string): Promise<any>;
    dissolveGroupSocket(channelId: string, userId: string): Promise<any>;
    leaveChannelSocket(channelId: string, userId: string): Promise<any>;
    findChannelsByUserId(userId: string): Promise<any[]>;
    private _createMembersOfChannel;
    private _getOtherMembersInfo;
    private _generateGroupAvatar;
    _formatChannelMembersRequest: (members: any) => Promise<any>;
    private _formatChannelResponse;
}
export {};
