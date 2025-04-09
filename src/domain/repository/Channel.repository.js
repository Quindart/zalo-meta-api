import Channel from '../../infrastructure/mongo/model/Channel.js';
import User from '../../infrastructure/mongo/model/User.js';


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

    async findOrCreateChannel(memberRequest, userCreateId, nameChannel) {

        let channel = await Channel.findOne({
            members: {
                $all: memberRequest.map((id) => ({ user: id })),
            },
        }).populate('members');

        if (channel) {
            return channel
        }

        let createMembers = this.createMembersOfChannel(memberRequest, userCreateId)

        channel = await Channel.create({
            name: nameChannel ? nameChannel : '',
            members: createMembers
        });

        return createMembers
    }


    async getChannel(channelId) {
        try {
            const chat = await Channel.findById(channelId).populate('members');
            if (!chat) {
                throw new Error("Chat not found");
            }
            return chat;
        } catch (error) {
            console.error("Error in getChat:", error);
        }
    };
}

export default new ChannelRepository();