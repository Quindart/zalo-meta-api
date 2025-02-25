import { HTTP_STATUS } from "../../constants/index.js";
import Channel from "../../infrastructure/mongo/model/Channel.js";
import Error from "../../utils/errors.js";
import { ROLE_MEMBER_OF_CHANNEL } from "../../constants/index.js";

class ChannelController {
    //TODO: CREATE CHANNEl
    async createGroup(req, res) {
        try {
            const { name, members } = req.body;
            const createMembers = [{
                user: "67b4b8fa40191e21f03c08f2",
                role: ROLE_MEMBER_OF_CHANNEL[0]
            }, ...members.map(memId => ({ user: memId, role: ROLE_MEMBER_OF_CHANNEL[2] }))]

            const channel = await Channel.create({ name, members: createMembers });
            return res.status(HTTP_STATUS.CREATED).json({
                status: HTTP_STATUS.CREATED,
                success: true,
                message: "Create group success",
                channel
            })
        } catch (error) {
           return Error.sendError(res, error)
        }
    }

    //TODO: GET ALL CHANNEL
    async getAllChannel(req, res) {
        try {
            const channels = await Channel.find().lean();
            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                success: true,
                message: "Get all channel success",
                channels,
                params:{
                    total: channels.length
                }
            })
        } catch (error) {
          return  Error.sendError(res, error);
        }
    }

    //TODO: GET CHANNEL BY ID
    async getChannelByID(req, res) {
        try {
            const {id} = req.params;
            const channel = await Channel.findById(id).lean();
            if (!channel) {
                return Error.sendNotFound(res, "Not found channel")
            }
            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                success: true,
                message: "Get channel success",
                channel,
                totalMembers: channel.members.length
                
            })
        } catch (error) {
           return Error.sendError(res, error);
        }
    }

    // ADD MEMBER TO CHANNEL BY GROUPID
    async addMemberToChannel(req, res) {
        try {
            let {id} =req.params
            const {userId} = req.body;
            const updatedChannel = await Channel.findByIdAndUpdate(
                id,
                { $push: { members: { user: userId, role: ROLE_MEMBER_OF_CHANNEL[2] } } },
                { new: true, select: '_id', lean: true }
            );
            if (!updatedChannel) {
                return Error.sendNotFound(res, "Not found channel")
            }
            return res.status(HTTP_STATUS.CREATED).json({
                status: HTTP_STATUS.CREATED,
                success: true,
                message: "Add member to channel success",
                totalMembers: members.length

            })
        } catch (error) {
           return Error.sendError(res, error);
        }
    }

    // GET ALL MEMBER OF CHANNEL BY channelId
    async getAllMember(req, res) {
        try {
            let { id } = req.params;
            const members = await Channel.findById(id).populate({
                path: 'members.user',
                select: "role avatar firstName lastName phone _id"
            }).select({members: 1, _id:0}).lean();

            if (!members) {
                return Error.sendNotFound(res, "Not found channel")
            }
            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                success: true,
                message: "Get all members of channel success",
                ...members,
                totalMembers: members.length
            });
        } catch (error) {
            return   Error.sendError(res, error);
        }
    }

    //OUT GROUP 
    async outChannel(req, res) {
        try {
            let {id} = req.params
            let {userId}  = req.body

            const updatedChannel = await Channel.findOneAndUpdate(
                { _id: id, "members.user": userId },
                { $pull: { members: { user: userId } } },
                { new: true, select: {members:1 , _id:0}, lean: true }
            );
            if (!updatedChannel) {
                Error.sendNotFound(res, "Channel not found or user not in channel")
            }
            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                success: true,
                message: "User removed from channel successfully",
                ...updatedChannel,
                
            });
        } catch (error) {
           return Error.sendError(res, error);
        }
    }

    // ASSIGN ROLE MEMBER
    async assignRoleMember(req, res) {
        try {
            let {id} =req.params
            let { userId, role } = req.body;
            role = role.trim();
            if (!ROLE_MEMBER_OF_CHANNEL.includes(role)) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    status: HTTP_STATUS.BAD_REQUEST,
                    success: false,
                    message: "Invalid role"
                });
            }
            const updatedChannel = await Channel.findOneAndUpdate(
                { _id: id, "members.user": userId },
                { $set: { "members.$.role": role } },
                { new: true, select: "members", lean: true }
            );
            if (!updatedChannel) {
                Error.sendNotFound(res, "Channel not found or user not in channel")
            }
            return res.status(HTTP_STATUS.CREATED).json({
                status: HTTP_STATUS.CREATED,
                success: true,
                message: "Role assigned successfully",
                user: updatedChannel.members.find(m => m.user.toString() === userId),
            })

        } catch (error) {
            return Error.sendError(res, error)
        }
    }

}

export default new ChannelController();
