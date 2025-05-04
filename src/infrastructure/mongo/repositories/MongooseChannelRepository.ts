import { Types } from "mongoose";
import { IChannelType, IMember } from "../../../domain/entities/channel/Channel.type.ts";
import { IChannelRepository } from "../../../domain/repositories/IChannel.repository.ts";
import { ROLE_TYPES, MESSAGE_TYPES } from "../../../types/enum/channel.enum.ts";
import { ChannelMapper } from "../mappers/ChannelMapper.ts";
import Channel from "../model/Channel.ts";
import User from "../model/User.ts";
import Message from "../model/Message.ts";
import SystemMessage from "../model/SystemMessage.ts";

export class MongooseChannelRepository implements IChannelRepository {
    async findOrCreateChannelSocket(memberRequestId: string, userCreateId: string, nameChannel: string, typeChannel: string, avatarChannel: string): Promise<any> {
        const memberIds = [
            new Types.ObjectId(memberRequestId),
            new Types.ObjectId(userCreateId)
        ];
        let channel = await Channel.findOne({
            type: typeChannel,
            members: {
                $all: memberIds.map(id => ({ $elemMatch: { user: id } })),
                $size: 2
            }
        });

        if (!channel) {
            const createMembers = [
                { user: memberRequestId, role: ROLE_TYPES.MEMBER },
                { user: userCreateId, role: ROLE_TYPES.MEMBER }
            ];

            channel = await Channel.create({
                type: typeChannel,
                members: createMembers,
                name: nameChannel,
                avatar: avatarChannel,
                lastMessage: null,
            });
        }
        return this._formatChannelResponse(channel);

    };
    async findChannelByIdAndByUserId(channelId: string, currentUserId?: string): Promise<any> {
        try {
            const channel = await Channel.findById(channelId)
                .populate({
                    path: "members.user",
                    select: "firstName lastName avatar email"
                })
                .lean();
            if (!channel) {
                throw new Error("Channel not found");
            }
            return this._formatChannelResponse(channel, currentUserId);
        } catch (error) {
            console.error("Error in getChannel:", error);
            throw error;
        }
    };
    async createChannelSocket(name: string, userId: string, memberIds: string[]): Promise<any> {

        const creatorId = userId;
        const membersList = this._createMembersOfChannel(creatorId, memberIds);

        const channel = new Channel({
            name,
            type: 'group',
            members: membersList,
            lastMessage: "",
            avatar: "https://i.pinimg.com/474x/c5/e7/30/c5e7305c0259beb7fc3d2f7ef3df6bb1.jpg",
        });

        // TẠO LASTMESSAGE TRONG CHANNEL
        const systemMessage = new SystemMessage({
            actionType: "channel_created",
        })
        const lastMessage = new Message({
            senderId: creatorId,
            content: "Welcome to the group!",
            status: "sent",
            channelId: channel._id,
            messageType: MESSAGE_TYPES.SYSTEM,
            systemMessageId: systemMessage._id,
        });
        systemMessage.messageId = lastMessage._id;
        channel.lastMessage = lastMessage._id;
        await lastMessage.save();
        await systemMessage.save();
        await channel.save();

        return {
            id: channel._id.toString(),
            name: channel.name,
            avatar: channel.avatar,
            type: channel.type,
            members: channel.members.map(member => ({
                userId: typeof member.user === 'object' ? member.user._id.toString() : member.user,
                role: member.role
            })),
            time: lastMessage.createdAt,
            message: lastMessage.content,
        };
    };

    async updateUserChannelSocket(channel: any): Promise<void> {
        if (!channel) return;
        const memberIds = channel.members.map((member: IMember) => member.user);
        const updatePromises = memberIds.map((memberId: string) =>
            User.findByIdAndUpdate(
                memberId,
                {
                    $addToSet: { channels: channel._id },
                    updatedAt: Date.now()
                },
                { new: true }
            )
        );
        await Promise.all(updatePromises);
    };
    async assignRoleChannelIdSocket(channelId: string, members: IMember[]): Promise<any> {
        if (!channelId || !Array.isArray(members)) {
            return;
        }
        const formattedMembers = await this._formatChannelMembersRequest(members);
        await Channel.findByIdAndUpdate(
            channelId,
            {
                $set: {
                    members: formattedMembers,
                    updatedAt: Date.now(),
                },
            },
            { new: true }
        );
    };
    async updateLastMessageSocket(channelId: string, lastMessageId: string): Promise<any> {
        if (!channelId || !lastMessageId) return null;
        const channel: any = await Channel.findById(new Types.ObjectId(channelId));
        if (!channel) return null;

        channel.lastMessage = lastMessageId;
        channel.updatedAt = new Date(Date.now());
        channel.deletedForUsers = [];

        const updatedChannel = await channel.save();
        return updatedChannel;
    };
    async removeMemberSocket(channelId: string, senderId: string, userId: string): Promise<any> {
        try {
            if (!channelId || !userId || !senderId) {
                throw new Error('Channel ID, Sender ID và User ID là bắt buộc');
            }

            const channelObjectId = new Types.ObjectId(channelId);
            const userObjectId = new Types.ObjectId(userId);
            const senderObjectId = new Types.ObjectId(senderId);

            const channel = await Channel.findById(channelObjectId);
            if (!channel) throw new Error('Channel không tồn tại');

            const senderIndex = channel.members.findIndex(
                member => member.user.toString() === senderObjectId.toString()
            );
            const userIndex = channel.members.findIndex(
                member => member.user.toString() === userObjectId.toString()
            );

            if (senderIndex === -1 || userIndex === -1) {
                throw new Error('Người gửi hoặc người cần xóa không nằm trong channel');
            }

            const sender = await User.findById(senderObjectId);
            const user = await User.findById(userObjectId);


            if (![ROLE_TYPES.CAPTAIN, ROLE_TYPES.SUB_CAPTAIN].includes(channel.members[senderIndex].role)) {
                throw new Error('Bạn không có quyền xóa thành viên');
            }

            const userRole = channel.members[userIndex].role;
            channel.members.splice(userIndex, 1);

            if (channel.members.length === 0) {
                channel.deletedAt = new Date();
            } else if (userRole === ROLE_TYPES.CAPTAIN) {
                channel.members[0].role = ROLE_TYPES.CAPTAIN;
            }

            const systemMessage = new SystemMessage({ actionType: "member_removed" });

            const leaveMessage = new Message({
                senderId: senderObjectId,
                content: `${sender.firstName} ${sender.lastName} removed ${user.firstName} ${user.lastName} from group`,
                status: "system",
                channelId: channelObjectId,
                messageType: MESSAGE_TYPES.SYSTEM,
                systemMessageId: systemMessage._id,
            });

            systemMessage.messageId = leaveMessage._id;
            channel.lastMessage = leaveMessage._id;

            await leaveMessage.save();
            await systemMessage.save();
            await channel.save();

            await User.findByIdAndUpdate(
                userObjectId,
                { $pull: { channels: channelObjectId } }
            );

            return {
                success: true,
                data: {
                    messageType: MESSAGE_TYPES.SYSTEM,
                    content: `${user.lastName} ${user.firstName} has been removed from the channel`,
                    sender: {
                        id: userObjectId,
                        name: `${user.lastName} ${user.firstName}`,
                        avatar: user.avatar,
                    },
                    members: channel.members.map(member => ({
                        userId: member.user.toString(),
                        role: member.role
                    })),
                    channelId: channelObjectId,
                    channel: this._formatChannelResponse(channel),
                    status: "send",
                    timestamp: new Date(),
                    isMe: true,
                }
            };

        } catch (error) {
            throw new Error(error.message || "Đã có lỗi xảy ra khi xóa thành viên");
        }
    };
    async addMemberToChannelSocket(channelId: string, userId: string): Promise<any> {
        if (!channelId || !userId) {
            throw new Error("Channel ID và User ID là bắt buộc");
        }

        const channelObjectId = new Types.ObjectId(channelId);
        const userObjectId = new Types.ObjectId(userId);

        // 1. Tìm channel
        const channel: any = await Channel.findById(channelObjectId);
        if (!channel) {
            throw new Error("Channel không tồn tại");
        }

        // 2. Kiểm tra nếu user đã trong nhóm thì không thêm nữa
        const alreadyMember = channel.members.some(
            member => member.user.toString() === userObjectId.toString()
        );
        if (alreadyMember) {
            throw new Error("User đã là thành viên của nhóm");
        }

        // 3. Thêm vào members với role MEMBER
        channel.members.push({
            user: userObjectId,
            role: ROLE_TYPES.MEMBER
        });

        // 4. Cập nhật updatedAt
        channel.updatedAt = Date.now();

        // 5. Lưu channel
        await channel.save();

        // 6. Cập nhật mảng channels trong User (nếu cần)
        await User.findByIdAndUpdate(
            userObjectId,
            { $addToSet: { channels: channelObjectId }, updatedAt: Date.now() }
        );

        // 7. Trả về channel đã format
        return this._formatChannelResponse(channel, userId);
    };

    async dissolveGroupSocket(channelId: string, userId: string): Promise<any> {
        try {
            if (!channelId || !userId) {
                throw new Error('Channel ID and User ID are required');
            }

            const channelObjectId = new Types.ObjectId(channelId);
            const userObjectId = new Types.ObjectId(userId);

            const user = await User.findById(userObjectId);
            if (!user) {
                throw new Error('User not found');
            }

            // Check if the user is the captain of the channel
            const channel = await Channel.findById(channelObjectId);
            if (!channel) {
                throw new Error('Channel not found');
            }

            const memberIndex = channel.members.findIndex(
                member => member.user.toString() === userObjectId.toString()
            );

            const member = channel.members.find(member => member.user.toString() === userObjectId.toString());
            if (!member || member.role !== ROLE_TYPES.CAPTAIN) {
                throw new Error('Only the captain can dissolve the group');
            }

            const systemMessage = new SystemMessage({
                actionType: "group_dissolved",
            });

            const dissolveMessage = new Message({
                senderId: userObjectId,
                content: `Trưởng nhóm ${user.lastName} ${user.firstName} đã giải tán nhóm`,
                status: "system",
                channelId: channelObjectId,
                messageType: MESSAGE_TYPES.SYSTEM,
                systemMessageId: systemMessage._id,
            });
            systemMessage.messageId = dissolveMessage._id;
            channel.lastMessage = dissolveMessage._id;
            channel.deletedAt = new Date();
            channel.isDeleted = true;
            channel.members.splice(memberIndex, 1);
            await systemMessage.save();
            await dissolveMessage.save();
            await channel.save();

            await User.findByIdAndUpdate(
                userObjectId,
                { $pull: { channels: channelObjectId } }
            );

            return {
                success: true,
                message: 'Group dissolved successfully',
                data: {
                    messageType: MESSAGE_TYPES.SYSTEM,
                    content: dissolveMessage.content,
                    sender: {
                        id: userObjectId,
                        name: `${user.lastName} ${user.firstName}`,
                        avatar: user.avatar,
                    },
                    members: channel.members.map(member => ({
                        userId: member.user._id.toString(),
                        role: member.role
                    })),
                    channelId: channelObjectId,
                    status: "send",
                    timestamp: new Date(),
                    isMe: true,
                }
            };
        } catch (error) {
            console.error('Error in dissolveGroup:', error);
            throw error;
        }
    };
    async leaveChannelSocket(channelId: string, userId: string): Promise<any> {
        try {
            if (!channelId || !userId) {
                throw new Error('Channel ID and User ID are required');
            }

            const channelObjectId = new Types.ObjectId(channelId);
            const userObjectId = new Types.ObjectId(userId);

            const channel = await Channel.findById(channelObjectId);
            if (!channel) {
                throw new Error('Channel not found');
            }

            const memberIndex = channel.members.findIndex(
                member => member.user.toString() === userObjectId.toString()
            );

            if (memberIndex === -1) {
                throw new Error('User is not a member of this channel');
            }

            const userRole = channel.members[memberIndex].role;

            const user = await User.findById(userObjectId);
            if (!user) {
                throw new Error('User not found');
            }

            if (channel.type === 'personal') {
                channel.deletedAt = new Date();
                await channel.save();
            } else {
                channel.members.splice(memberIndex, 1);

                if (channel.members.length === 0) {
                    channel.deletedAt = new Date();
                }
                else if (userRole === ROLE_TYPES.CAPTAIN && channel.members.length > 0) {
                    channel.members[0].role = ROLE_TYPES.CAPTAIN;
                }

                const systemMessage = new SystemMessage({
                    actionType: "member_removed",
                });

                const leaveMessage = new Message({
                    senderId: userObjectId,
                    content: `${user.firstName} ${user.lastName} has left the channel`,
                    status: "system",
                    channelId: channelObjectId,
                    messageType: MESSAGE_TYPES.SYSTEM,
                    systemMessageId: systemMessage._id,
                });

                systemMessage.messageId = leaveMessage._id;
                channel.lastMessage = leaveMessage._id;
                await leaveMessage.save();
                await systemMessage.save();
                await channel.save();
            }

            await User.findByIdAndUpdate(
                userObjectId,
                { $pull: { channels: channelObjectId } }
            );

            return {
                success: true,
                message: 'Successfully left the channel',
                data: {
                    messageType: MESSAGE_TYPES.SYSTEM,
                    content: `${user.lastName} ${user.firstName} has left the channel`,
                    sender: {
                        id: userObjectId,
                        name: `${user.lastName} ${user.firstName}`,
                        avatar: user.avatar,
                    },
                    members: channel.members.map(member => ({
                        userId: member.user._id.toString(),
                        role: member.role
                    })),
                    channelId: channelObjectId,
                    status: "send",
                    timestamp: new Date(),
                    isMe: true,
                }
            };
        } catch (error) {
            console.error('Error in leaveChannel:', error);
            throw error;
        }
    };

    async findChannelsByUserId(userId: string): Promise<any[]> {
        const channels = await Channel.find({
            "members.user": userId
        })
        const mapper = new ChannelMapper()
        return channels.map(channel => mapper.toDomain(channel))
    }

    //TODO: Private function
    private async _createMembersOfChannel(creatorId: string, members: string[]) {
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

    private async _getOtherMembersInfo(channel, currentUserId) {
        return channel.members
            .filter(member => {
                const memberId = typeof member.user === 'object'
                    ? member.user._id.toString()
                    : member.user.toString();
                return memberId !== currentUserId;
            })
            .map(member => ({
                userId: member.user._id.toString(),
                role: member.role,
                firstName: member.user.firstName,
                lastName: member.user.lastName,
                avatar: member.user.avatar,
                email: member.user.email
            }));
    }

    private async _generateGroupAvatar(members: IMember[]): Promise<string[]> {
        try {
            if (!members || members.length < 2) {
                return ["https://i.pinimg.com/474x/c5/e7/30/c5e7305c0259beb7fc3d2f7ef3df6bb1.jpg"];
            }

            const memberIds = members.slice(0, 3).map(member =>
                typeof member.user === 'object' ? member.user : member.user
            );

            const users = await User.find({
                _id: { $in: memberIds }
            }).select('avatar').lean();

            if (!users || users.length === 0) {
                return ["https://i.pinimg.com/474x/c5/e7/30/c5e7305c0259beb7fc3d2f7ef3df6bb1.jpg"];
            }

            const avatars = users
                .filter(user => user.avatar)
                .map(user => user.avatar)
                .slice(0, 3);

            return avatars;
        } catch (error) {
            console.error('Error generating group avatar:', error);
            return ["https://i.pinimg.com/474x/c5/e7/30/c5e7305c0259beb7fc3d2f7ef3df6bb1.jpg"];
        }
    }

    private async _formatChannelMembersRequest(members: IMember[]) {
        return members.map(mem => ({
            user: new Types.ObjectId(mem.user),
            role: mem.role,
        }));
    };

    private async _formatChannelResponse(channel: any, currentUserId?: string) {
        let name = channel.name;
        let avatar = channel.avatar;
        let avatarGroup = channel.avatar;
        if (channel.type === 'personal') {
            const otherMember = this._getOtherMembersInfo(channel, currentUserId)[0];

            if (otherMember) {
                name = `${otherMember.lastName} ${otherMember.firstName}`;
                avatar = otherMember.avatar;
            }
        } else {
            avatarGroup = (await this._generateGroupAvatar(channel.members))[0];
        }
        return {
            id: channel._id.toString(),
            name: name,
            avatar: avatar,
            avatarGroup: avatarGroup,
            type: channel.type,
            members: channel.members.map((member: IMember) => ({
                userId: member.user,
                role: member.role
            })),
            time: channel.lastMessage ? channel.lastMessage.createdAt : null,
            message: channel.lastMessage ? channel.lastMessage.content : null,
            deletedForUsers: channel.deletedForUsers && channel.deletedForUsers.map(user => user.user.toString()),
            isDeleted: channel.isDeleted,
        };
    }

}