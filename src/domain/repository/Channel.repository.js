import Channel from '../../infrastructure/mongo/model/Channel.js';
import User from '../../infrastructure/mongo/model/User.js';
import mongoose from 'mongoose';

class ChannelRepository {

    updateUserChannels = async (channel) => {
        if (channel) {
            const memberIds = channel.members.map((member) => member.user);
            await Promise.all(
                memberIds.map(async (memId) => {
                    await User.findByIdAndUpdate(
                        memId,
                        {
                            $addToSet: { channels: channel._id },
                            updatedAt: Date.now(),
                        },
                        { new: true }
                    );
                })
            );
        }
    };


    //TODO: nếu 2 thành viên => mặc định là 2role member, còn không thì người tạo là role cao nhất 
    createMembersOfChannel(members, userCreateChannelId) {
        let createMembers
        if (members.length >= 3) {
            createMembers = [{
                user: userCreateChannelId,
                role: ROLE_MEMBER_OF_CHANNEL[0]  //TODO: CAPTAIN
            }, ...members.map(memId => ({ user: memId, role: ROLE_MEMBER_OF_CHANNEL[2] }))] // TODO: MEMBER
        }
        createMembers = members.map(memId => ({ user: memId, role: ROLE_MEMBER_OF_CHANNEL[2] }))
        return createMembers

    }

    //TODO: dùng để kiểm tra và tạo channel personal
    async findOrCreateChannel(memberRequestId, userCreateId, nameChannel, typeChannel, avatarChannel) {
        let channel = await Channel.findOne({
            type: typeChannel ? typeChannel : 'personal',
            members: {
                $all: [
                    { $elemMatch: { user: new mongoose.Types.ObjectId(memberRequestId) } },
                    { $elemMatch: { user: new mongoose.Types.ObjectId(userCreateId) } },
                ],
                $size: 2
            }
        });

        if (!channel) {
            let createMembers = [
                {
                    user: memberRequestId,
                    role: "member"
                },
                {
                    user: userCreateId,
                    role: "member"
                }
            ]

            channel = await Channel.create({
                type: typeChannel ? typeChannel : 'personal',
                name: '',
                avatar: avatarChannel ? avatarChannel : '',
                members: createMembers
            });
        }

        return {
            id: channel._id.toString(),
            name: nameChannel,
            avatar: channel.avatar,
            type: channel.type,
            members: channel.members.map((member) => ({
                userId: member.user.toString(),
                role: member.role,
            })),
            createdAt: channel.createdAt,
            updatedAt: channel.updatedAt,
        };
    }


    async getChannel(channelId, currentUserId) {
        try {
            const channel = await Channel.findById(channelId).populate({
                path: "members.user",
                select: "firstName lastName avatar email",
            }).lean();

            if (!channel) {
                throw new Error("channel not found");
            }

            const filteredMembers = channel.members
                .filter((member) => member.user._id.toString() !== currentUserId)
                .map((member) => ({
                    userId: member.user._id.toString(),
                    role: member.role,
                    firstName: member.user.firstName, // Thêm thông tin từ User
                    lastName: member.user.lastName,
                    avatar: member.user.avatar,
                    email: member.user.email,
                }));

            return {
                id: channel._id.toString(),
                name: filteredMembers[0].lastName + ' ' + filteredMembers[0].firstName,
                avatar: filteredMembers[0].avatar,
                type: channel.type,
                members: channel.members.map((member) => ({
                    userId: member.user.toString(),
                    role: member.role,
                })),
                createdAt: channel.createdAt,
                updatedAt: channel.updatedAt,
            };
        } catch (error) {
            console.error("Error in getChat:", error);
        }
    };


    async getChannels(currentUserId) {
        try {
            const channels = await Channel.find({
                'members.user': currentUserId,
            })
                .sort({ createAt: -1 })
                .populate({
                    path: "members.user",
                    select: "firstName lastName avatar email",
                })
                .exec();

            console.log('channels', channels)

            const channelsWithDetails = channels.map((channel) => {
                return {
                    id: channel._id.toString(),
                    name: channel.name,
                    avatar: channel.avatar,
                    type: channel.type,
                    members: channel.members.map((member) => ({
                        userId: member.user,
                        role: member.role,
                    })),
                    time: channel.createAt,
                };
            })

            return channelsWithDetails;
        } catch (error) {
            console.error('Error fetching channels:', error);
            throw error;
        }
    }
}

export default new ChannelRepository();