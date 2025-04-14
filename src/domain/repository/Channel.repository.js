// import Channel from '../../infrastructure/mongo/model/Channel.js';
// import User from '../../infrastructure/mongo/model/User.js';
// import mongoose from 'mongoose';

// class ChannelRepository {

//     updateUserChannels = async (channel) => {
//         if (channel) {
//             const memberIds = channel.members.map((member) => member.user);
//             await Promise.all(
//                 memberIds.map(async (memId) => {
//                     await User.findByIdAndUpdate(
//                         memId,
//                         {
//                             $addToSet: { channels: channel._id },
//                             updatedAt: Date.now(),
//                         },
//                         { new: true }
//                     );
//                 })
//             );
//         }
//     };


//     //TODO: nếu 2 thành viên => mặc định là 2role member, còn không thì người tạo là role cao nhất 
//     createMembersOfChannel(members, userCreateChannelId) {
//         let createMembers
//         if (members.length >= 3) {
//             createMembers = [{
//                 user: userCreateChannelId,
//                 role: ROLE_MEMBER_OF_CHANNEL[0]  //TODO: CAPTAIN
//             }, ...members.map(memId => ({ user: memId, role: ROLE_MEMBER_OF_CHANNEL[2] }))] // TODO: MEMBER
//         }
//         createMembers = members.map(memId => ({ user: memId, role: ROLE_MEMBER_OF_CHANNEL[2] }))
//         return createMembers

//     }

//     //TODO: dùng để kiểm tra và tạo channel personal
//     async findOrCreateChannel(memberRequestId, userCreateId, nameChannel, typeChannel, avatarChannel) {
//         let channel = await Channel.findOne({
//             type: typeChannel ? typeChannel : 'personal',
//             members: {
//                 $all: [
//                     { $elemMatch: { user: new mongoose.Types.ObjectId(memberRequestId) } },
//                     { $elemMatch: { user: new mongoose.Types.ObjectId(userCreateId) } },
//                 ],
//                 $size: 2
//             }
//         });

//         if (!channel) {
//             let createMembers = [
//                 {
//                     user: memberRequestId,
//                     role: "member"
//                 },
//                 {
//                     user: userCreateId,
//                     role: "member"
//                 }
//             ]

//             channel = await Channel.create({
//                 type: typeChannel ? typeChannel : 'personal',
//                 members: createMembers
//             });
//         }

//         return {
//             id: channel._id.toString(),
//             name: nameChannel,
//             avatar: channel.avatar,
//             type: channel.type,
//             members: channel.members.map((member) => ({
//                 userId: member.user.toString(),
//                 role: member.role,
//             })),
//             createdAt: channel.createdAt,
//             updatedAt: channel.updatedAt,
//         };
//     }


//     async getChannel(channelId, currentUserId) {
//         try {
//             const channel = await Channel.findById(channelId).populate({
//                 path: "members.user",
//                 select: "firstName lastName avatar email",
//             }).lean();

//             if (!channel) {
//                 throw new Error("channel not found");
//             }

//             const filteredMembers = channel.members
//                 .filter((member) => member.user._id.toString() !== currentUserId)
//                 .map((member) => ({
//                     userId: member.user._id.toString(),
//                     role: member.role,
//                     firstName: member.user.firstName, // Thêm thông tin từ User
//                     lastName: member.user.lastName,
//                     avatar: member.user.avatar,
//                     email: member.user.email,
//                 }));

//             return {
//                 id: channel._id.toString(),
//                 name: filteredMembers[0].lastName + ' ' + filteredMembers[0].firstName,
//                 avatar: filteredMembers[0].avatar,
//                 type: channel.type,
//                 members: channel.members.map((member) => ({
//                     userId: member.user.toString(),
//                     role: member.role,
//                 })),
//                 createdAt: channel.createdAt,
//                 updatedAt: channel.updatedAt,
//             };
//         } catch (error) {
//             console.error("Error in getChat:", error);
//         }
//     };


//     async getChannels(currentUserId) {
//         try {
//             const channels = await Channel.find({
//                 'members.user': currentUserId,
//             })
//                 .sort({ createAt: -1 })
//                 .populate({
//                     path: "members.user",
//                     select: "firstName lastName avatar email",
//                 })
//                 .exec();

//             const channelsWithDetails = channels.map((channel) => {
//                 let name = null;
//                 let avatar = null;
//                 if(channel.type === 'personal'){
//                     const filteredMembers = channel.members
//                     .filter((member) => member.user._id.toString() !== currentUserId)
//                     .map((member) => ({
//                         userId: member.user._id.toString(),
//                         role: member.role,
//                         firstName: member.user.firstName, // Thêm thông tin từ User
//                         lastName: member.user.lastName,
//                         avatar: member.user.avatar,
//                         email: member.user.email,
//                     }))[0];

//                     console.log('filteredMembers', filteredMembers)

//                     name = filteredMembers.lastName + ' ' + filteredMembers.firstName;
//                     avatar = filteredMembers.avatar;
//                 }

//                 return {
//                     id: channel._id.toString(),
//                     name: name ? name : channel.name,
//                     avatar: avatar ? avatar : channel.avatar,
//                     type: channel.type,
//                     members: channel.members.map((member) => ({
//                         userId: member.user,
//                         role: member.role,
//                     })),
//                     time: channel.createAt,
//                 };
//             })

//             return channelsWithDetails;
//         } catch (error) {
//             console.error('Error fetching channels:', error);
//             throw error;
//         }
//     }
// }

// export default new ChannelRepository();

import Channel from '../../infrastructure/mongo/model/Channel.js';
import User from '../../infrastructure/mongo/model/User.js';
import Message from '../../infrastructure/mongo/model/Message.js';
import mongoose from 'mongoose';

// Constants
const ROLE_TYPES = {
  CAPTAIN: 'captain',
  MEMBER: 'member'
};

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
    const lastMessage = new Message({
      senderId: creatorId,
      content: "Welcome to the group!",
      status: "sent",
      channelId: channel._id,
    });

    await lastMessage.save();
    channel.lastMessage = lastMessage._id;
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
              { deletedAt: null },
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

      console.log('channels', channels)

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
        };
      });
    } catch (error) {
      console.error('Error fetching channels:', error);
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
      updatedAt: channel.updatedAt
    };
  }
}

export default new ChannelRepository();