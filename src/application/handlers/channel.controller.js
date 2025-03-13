import { HTTP_STATUS } from "../../constants/index.js";
import Channel from "../../infrastructure/mongo/model/Channel.js";
import Error from "../../utils/errors.js";
import { ROLE_MEMBER_OF_CHANNEL } from "../../constants/index.js";
import authenController from "./authen.controller.js";

class ChannelController {
    //TODO: CREATE CHANNEl
    async createGroup(req, res) {
        try {
            const { name, members } = req.body;
            const userId = req.user.id;
            const createMembers = [{
                user: userId,
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
            const userId = req.user.id;
            const channels = await Channel.find({
                "members.user": userId
            }).lean();
            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                success: true,
                message: "Get all channel success",
                channels,
                params: {
                    total: channels.length
                }
            })
        } catch (error) {
            return Error.sendError(res, error);
        }
    }

    //TODO: GET CHANNEL BY ID
    async getChannelByID(req, res) {
        try {
            const { id } = req.params;
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
            let { id } = req.params
            const { userId } = req.body;
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
            }).select({ members: 1, _id: 0 }).lean();

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
            return Error.sendError(res, error);
        }
    }

    //OUT GROUP 
    async outChannel(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const channel = await Channel.findById(id).lean();
            if (!channel) {
                return Error.sendNotFound(res, "Channel not found");
            }
            const memberIndex = channel.members.findIndex(member => member.user.toString() === userId);
            if (memberIndex === -1) {
                return Error.sendNotFound(res, "User not in channel");
            }
            const memberRole = channel.members[memberIndex].role;
            //CASE CAPTAIN ROLE
            if (memberRole === ROLE_MEMBER_OF_CHANNEL[0]) {
                const coCaptainIndex = channel.members.findIndex(m => m.role === ROLE_MEMBER_OF_CHANNEL[1]);
                if (coCaptainIndex !== -1) {
                    channel.members[coCaptainIndex].role = ROLE_MEMBER_OF_CHANNEL[0];
                } else {
                    const newCaptainIndex = channel.members.findIndex(m => m.user.toString() !== userId);
                    if (newCaptainIndex !== -1) {
                        channel.members[newCaptainIndex].role = ROLE_MEMBER_OF_CHANNEL[0];
                    }
                }
            }
            // Remove user
            channel.members.splice(memberIndex, 1);
            const updatedChannel = await Channel.findByIdAndUpdate(
                id,
                { $set: { members: channel.members } },
                { new: true, lean: true }
            );

            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                success: true,
                message: "User removed from channel successfully",
                members: updatedChannel.members,
                totalMembers: updatedChannel.members.length
            });

        } catch (error) {
            return Error.sendError(res, error);
        }
    }

    // ASSIGN ROLE MEMBER
    async assignRoleMember(req, res) {
        try {
            let { id } = req.params
            let { userId, role } = req.body;
            console.log("check data: ", id);
            console.log("check userId:", userId);
            console.log("check role:", role);

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
