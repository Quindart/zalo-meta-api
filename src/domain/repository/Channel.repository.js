import Channel from '../../infrastructure/mongo/model/Channel.js';
import User from '../../infrastructure/mongo/model/User.js';
import Message from '../../infrastructure/mongo/model/Message.js';
import SystemMessage from '../../infrastructure/mongo/model/SystemMessage.js';
import mongoose from 'mongoose';
import { content } from 'googleapis/build/src/apis/content/index.js';
import { is } from 'useragent';

const ROLE_TYPES = {
  CAPTAIN: 'captain',
  MEMBER: 'member'
};

const MEMBER_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  VIDEO: 'video',
  FILE: 'file',
  AUDIO: 'audio',
  EMOJI: 'emoji',
  SYSTEM: 'system',
  OTHER: 'other'
}

class ChannelRepository {

  async createChannel(name, currentUserId, members) {
    const creatorId = currentUserId;
    const membersList = this.createMembersOfChannel(members, creatorId);

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
      messageType: MEMBER_TYPES.SYSTEM,
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
  }


  async updateUserChannels(channel) {
    if (!channel) return;

    const memberIds = channel.members.map(member => member.user);

    const updatePromises = memberIds.map(memberId =>
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
  }

  async updateLastMessage(channelId, lastMessageId) {
    if (!channelId || !lastMessageId) return null;
    const channel = await Channel.findById(new mongoose.Types.ObjectId(channelId));
    if (!channel) return null;

    channel.lastMessage = lastMessageId;
    channel.updatedAt = Date.now();
    const updatedChannel = await channel.save();
    return updatedChannel;
  }

  createMembersOfChannel(members, creatorId) {
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

  async findOrCreateChannel(memberRequestId, userCreateId, nameChannel, typeChannel = 'personal', avatarChannel) {
    const memberIds = [
      new mongoose.Types.ObjectId(memberRequestId),
      new mongoose.Types.ObjectId(userCreateId)
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
  }

  async getChannel(channelId, currentUserId) {
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

      let name = channel.name;
      let avatar = channel.avatar;
      if (channel.type === 'personal') {
        const otherMember = this._getOtherMembersInfo(channel, currentUserId)[0];

        if (otherMember) {
          name = `${otherMember.lastName} ${otherMember.firstName}`;
          avatar = otherMember.avatar;
        }
      }

      return {
        id: channel._id.toString(),
        name: name,
        avatar: avatar,
        type: channel.type,
        members: channel.members.map(member => ({
          userId: member.user._id.toString(),
          role: member.role
        })),
        createdAt: channel.createdAt,
        isDeleted: channel.isDeleted,
      };
    } catch (error) {
      console.error("Error in getChannel:", error);
      throw error;
    }
  }

  async getChannels(currentUserId) {
    try {
      const channels = await Channel.aggregate([
        {
          $match: {
            "members.user": new mongoose.Types.ObjectId(currentUserId),
            "$and": [
              // { deletedAt: null },
              { lastMessage: { $ne: null } }
            ]
          },
        },
        {
          $lookup: {
            from: "messages",
            localField: "lastMessage",
            foreignField: "_id",
            as: "lastMessageData",
          },
        },
        {
          $unwind: {
            path: "$lastMessageData",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "members.user",
            foreignField: "_id",
            as: "membersData",
          },
        },
        {
          $sort: {
            "lastMessageData.createdAt": -1,
            createdAt: -1,
          },
        },
        {
          $project: {
            _id: 1,
            type: 1,
            name: 1,
            avatar: 1,
            description: 1,
            createdAt: 1,
            updatedAt: 1,
            deletedAt: 1,
            lastMessage: {
              _id: "$lastMessageData._id",
              content: "$lastMessageData.content",
              senderId: "$lastMessageData.senderId",
              createdAt: "$lastMessageData.createdAt",
              status: "$lastMessageData.status",
            },
            members: {
              $map: {
                input: "$members",
                as: "member",
                in: {
                  user: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$membersData",
                          as: "userData",
                          cond: { $eq: ["$$userData._id", "$$member.user"] },
                        },
                      },
                      0,
                    ],
                  },
                  role: "$$member.role",
                },
              },
            },
          },
        },
      ]).exec();
      return channels.map(channel => {
        let name = channel.name;
        let avatar = channel.avatar;

        if (channel.type === 'personal') {
          const otherMember = this._getOtherMembersInfo(channel, currentUserId)[0];
          if (otherMember) {
            name = `${otherMember.lastName} ${otherMember.firstName}`;
            avatar = otherMember.avatar;
          }
        }

        return {
          id: channel._id.toString(),
          name,
          avatar,
          type: channel.type,
          members: channel.members.map(member => ({
            userId: typeof member.user === 'object' ? member.user._id.toString() : member.user,
            role: member.role
          })),
          time: channel.lastMessage.createdAt,
          message: channel.lastMessage.content,
          isDeleted: channel.isDeleted,
        };
      })
    } catch (error) {
      console.error('Error fetching channels:', error);
      throw error;
    }
  }

  async leaveChannel(channelId, userId) {
    try {
      if (!channelId || !userId) {
        throw new Error('Channel ID and User ID are required');
      }

      const channelObjectId = new mongoose.Types.ObjectId(channelId);
      const userObjectId = new mongoose.Types.ObjectId(userId);

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
          messageType: MEMBER_TYPES.SYSTEM,
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
          messageType: MEMBER_TYPES.SYSTEM,
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
  }

  async dissolveGroup(channelId, userId) {
    try {
      if (!channelId || !userId) {
        throw new Error('Channel ID and User ID are required');
      }

      const channelObjectId = new mongoose.Types.ObjectId(channelId);
      const userObjectId = new mongoose.Types.ObjectId(userId);

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
        messageType: MEMBER_TYPES.SYSTEM,
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
        data:{
          messageType: MEMBER_TYPES.SYSTEM,
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
  }

  _getOtherMembersInfo(channel, currentUserId) {
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

  _formatChannelResponse(channel) {
    return {
      id: channel._id.toString(),
      name: channel.name,
      avatar: channel.avatar,
      type: channel.type,
      members: channel.members.map(member => ({
        userId: typeof member.user === 'object' ? member.user.toString() : member.user.toString(),
        role: member.role
      })),
      createdAt: channel.createdAt,
      updatedAt: channel.updatedAt,
    };
  }
}

export default new ChannelRepository();