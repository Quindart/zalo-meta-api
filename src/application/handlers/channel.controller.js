import { HTTP_STATUS } from "../../constants/index.js";
import Channel from "../../infrastructure/mongo/model/Channel.js";
import Error from "../../utils/errors.js";
import { responseEntity } from "../../utils/query.js";
import { ROLE_MEMBER_OF_CHANNEL } from "../../constants/index.js";
import mongoose from "mongoose";
class ChannelController {

    // CREATE CHANNEl
    async createGroup(req, res) {
        try {
            const { name, members } = req.body;
            const createMembers = [{
                user: "67b4b8fa40191e21f03c08f2",
                role: ROLE_MEMBER_OF_CHANNEL[0]
            }, ...memberData.map(memId => ({ user: memId, role: ROLE_MEMBER_OF_CHANNEL[2] }))]

            const chanel = await Channel.create({ name, members: createMembers });
            return res.status(HTTP_STATUS.CREATED).json({
                status: HTTP_STATUS.CREATED,
                success: true,
                message: "Create group success",
                chanel
            })
        } catch (error) {
            Error.sendError(res, error)
        }
    }

    // GET ALL CHANNEL
    async getAllChannel(req, res) {
        try {
            const channels = await Channel.find({}).lean();
            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                success: true,
                message: "Get all channel success",
                channels
            })
        } catch (error) {
            Error.sendError(res, error);
        }
    }

    // GET CHANNEL BY ID
    async getChannelByID(req, res) {
        try {
            const channelId = req.params.id;
            const channel = await Channel.findById(channelId).lean();
            if (!channel) {
                return Error.sendNotFound(res, "Not found channel")
            }
            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                success: true,
                message: "Get channel success",
                channel
            })
        } catch (error) {
            Error.sendError(res, error);
        }
    }

    // ADD MEMBER TO CHANNEL BY GROUPID
    async addMemberToChannel(req, res) {
        try {
            const channelId = req.query.channelId;
            const userId = req.query.userId;
            const updatedChannel = await Channel.findByIdAndUpdate(
                channelId,
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
            })
        } catch (error) {
            Error.sendError(res, error);
        }
    }

    // GET ALL MEMBER OF CHANNEL BY channelId
    async getAllMember(req, res) {
        try {
            let { channelId } = req.query;
            const members = await Channel.findById(channelId).select("members").lean();
            if (!members) {
                return Error.sendNotFound(res, "Not found channel")
            }
            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                success: true,
                message: "Get all members of channel success",
                members: members,
            });
        } catch (error) {
            Error.sendError(res, error);
        }
    }

    //OUT GROUP 
    async outChannel(req, res) {
        try {
            let userId = "67baead7581e27c55e2b3d26";
            let channelId = "67bae576d278d1e7fdc6469e"
            const updatedChannel = await Channel.findOneAndUpdate(
                { _id: channelId, "members.user": userId },
                { $pull: { members: { user: userId } } },
                { new: true, select: "members", lean: true }
            );
            if (!updatedChannel) {
                Error.sendNotFound(res, "Channel not found or user not in channel")
            }
            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                success: true,
                message: "User removed from channel successfully",
                members: updatedChannel,
            });
        } catch (error) {
            Error.sendError(res, error);
        }
    }

    // ASSIGN ROLE MEMBER
    async assignRoleMember(req, res) {
        try {
            let { userId, channelId, role } = req.body;
            role = role.trim();
            if (!ROLE_MEMBER_OF_CHANNEL.includes(role)) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    status: HTTP_STATUS.BAD_REQUEST,
                    success: false,
                    message: "Invalid role"
                });
            }
            const updatedChannel = await Channel.findOneAndUpdate(
                { _id: channelId, "members.user": userId },
                { $set: { "members.$.role": role } },
                { new: true, select: "members", lean: true }
            );
            if (!updatedChannel) {
                Error.sendNotFound(res, "Channel not found or user not in channel")
            }
            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                success: true,
                message: "Role assigned successfully",
                user: updatedChannel.members.find(m => m.user.toString() === userId),
            })

        } catch (error) {
            Error.sendError(res, error)
        }
    }

}

export default new ChannelController();
