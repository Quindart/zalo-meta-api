import { inject, injectable } from "inversify";
import TYPES from "../../../infrastructure/inversify/type";
import { ChannelMapper } from "../../../infrastructure/mongo/mappers/ChannelMapper";
import { IChannelType, IMember } from "../../../domain/entities/channel/Channel.type";
import { IChannelRepository } from "../../../domain/repositories/IChannel.repository";
import { IChannelCreateData } from "../../../infrastructure/mongo/repositories/MongooseChannelRepository";
import { MESSAGE_TYPES, ROLE_TYPES } from "../../../types/enum/channel.enum";
import { IChannelService } from "../../interfaces/services/IChannelService";
import { IMessageService } from "../../interfaces/services/IMessageService";
import { ILogger } from "../../../infrastructure/logger/WinstonLogger";
import { GROUP_EVENT_TYPE } from "../../../types/enum/systemMessage.enum";
import { IUserService } from "../../interfaces/services/IUserService";

type ChannelRepositoryType = IChannelRepository
type LoggerServiceType = ILogger
type MessageServiceType = IMessageService
type UserServiceType = IUserService
@injectable()
export class ChannelService implements IChannelService {
    constructor(
        @inject(TYPES.ChannelRepository) private readonly repository: ChannelRepositoryType,
        @inject(TYPES.MessageService) private readonly messageService: MessageServiceType,
        @inject(TYPES.Logger) private readonly logger: LoggerServiceType,
        @inject(TYPES.ChannelMapper) private readonly mapper: ChannelMapper,
        @inject(TYPES.UserService) private readonly userService: UserServiceType,
    ) { }
    async getChannel(channelId: string, currentUserId?: string): Promise<any> {
        return await this.repository.getChannel(channelId, currentUserId)
    }
    async getChannels(currentUserId: string): Promise<any> {
        return await this.repository.getChannels(currentUserId)
    }

    async findOne(id: string, queries?: string) {
        const channelDocument = await this.repository.findOne(id, queries)
        return this.mapper.toDomain(channelDocument)
    }
    async createChannel(memberRequestId: string, userCreateId: string, nameChannel: string, typeChannel: IChannelType, avatarChannel: string) {
        const channelDocument = await this.repository.create({ memberRequestId, userCreateId, nameChannel, typeChannel, avatarChannel })
        return this.mapper.toDomain(channelDocument)
    }
    async createChannelSocket(name: string, userId: string, members: any[]) {
        return await this.repository.createChannelSocket(name, userId, members)
    }

    async findOrCreateChannelPersonal(memberRequestId: string, userCreateId: string, nameChannel: string, typeChannel: 'personal' | 'group', avatarChannel: string) {
        return await this.repository.findOrCreateChannelPersonal(memberRequestId, userCreateId, nameChannel, typeChannel, avatarChannel)
    }
    async findChannelByIdAndByUserId(channelId: string, currentUserId?: string) {
        return await this.repository.findChannelByIdAndByUserId(channelId, currentUserId)
    }
    async createChannelGroup(name: string, userId: string, memberIds: string[]) {
        const creatorId = userId;
        const membersList = this._createMembersOfChannel(creatorId, memberIds);

        const channel = await this.repository.createChannelGroup(name, membersList);
        const systemMessage = await this.messageService.createSystemMessage(GROUP_EVENT_TYPE.CHANNEL_CREATED)

        const lastMessage = await this.messageService.createMessage({
            senderId: creatorId,
            content: "Welcome to the group!",
            status: "sent",
            channelId: channel._id.toString(),
            messageType: MESSAGE_TYPES.SYSTEM,
            systemMessageId: systemMessage._id.toString(),
        })

        systemMessage.messageId = lastMessage._id
        channel.lastMessage = lastMessage._id;

        this.repository.toSave(channel)
        this.messageService.toSave(systemMessage)
        this.messageService.toSave(lastMessage)
    }

    async updateUserChannel(channel: IChannelType): Promise<void> {
        if (!channel) return
        const memberIds = channel.members.map((member: IMember) => member.user);
        const updatePromises = memberIds.map((member) => {
            this.userService.findByIdAndUpdateChannel(channel._id, member)
        })
        await Promise.all(updatePromises);
    }

    async assignRoleChannelId(channelId: string, members: any[]): Promise<any> {
        return await this.repository.assignRoleChannelIdSocket(channelId, members)
    }

    async updateLastMessage(channelId: string, lastMessageId: string) {
        return await this.repository.updateLastMessageSocket(channelId, lastMessageId)
    }

    //! TODO: tach service - mongo
    async removeMember(channelId: string, senderId: string, userId: string) {
        return await this.repository.removeMemberSocket(channelId, senderId, userId)
    }

    async addMemberToChannel(channelId: string, userId: string): Promise<any> {
        return await this.repository.addMemberToChannelSocket(channelId, userId)
    }

    async dissolveGroup(channelId: string, userId: string): Promise<any> {
        return await this.repository.dissolveGroupSocket(channelId, userId)
    }
    async leaveChannel(channelId: string, userId: string): Promise<any> {
        return await this.repository.leaveChannelSocket(channelId, userId)
    }

    async findChannelsByUserId(userId: string): Promise<any[]> {
        return await this.repository.findChannelsByUserId(userId)
    }

    private _createMembersOfChannel(creatorId: string, members: string[]): IMember[] {
        if (members.length >= 2) {
            return [
                { user: creatorId, role: ROLE_TYPES.CAPTAIN },
                ...members.map(memberId => ({
                    user: memberId,
                    role: ROLE_TYPES.MEMBER
                }))
            ];
        }
        return members.map(memberId => ({
            user: memberId,
            role: ROLE_TYPES.MEMBER
        }));
    }


}