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
            const { name, memberData } = req.body;
            const members = [];
            const captain = {
                user: "67b4b8fa40191e21f03c08f2",
                role: ROLE_MEMBER_OF_CHANNEL[0]
            };
            members.push(captain);
            memberData.map(item => {
                members.push({
                    user: item,
                    role: ROLE_MEMBER_OF_CHANNEL[2]
                })
            })
            const chanel = await Channel.create({ name, members });
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
            const channels = await Channel.find({});
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
            const channelID = req.params.id;
            const channel = await Channel.findById(channelID);
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
            const channelID = req.query.channelID;
            const user = req.query.userID;
            const channel = await Channel.findById(channelID);
            if (!channel) {
                return Error.sendNotFound(res, "Not found channel")
            }
            channel.members.push({
                user: user,
                role: ROLE_MEMBER_OF_CHANNEL[2]
            });
            await channel.save();
            return res.status(HTTP_STATUS.CREATED).json({
                status: HTTP_STATUS.CREATED,
                success: true,
                message: "Add member to channel success",
            })
        } catch (error) {
            Error.sendError(res, error);
        }
    }

    // GET ALL MEMBER OF CHANNEL BY CHANNELID
    async getAllMember(req, res) {
        try {
            let { channelID } = req.query;
            console.log("check channelID", channelID);
            const channel = await Channel.findById(channelID);
            if (!channel) {
                return Error.sendNotFound(res, "Not found channel")
            }

            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                success: true,
                message: "Get all members of channel success",
                members: channel.members,
            });
        } catch (error) {
            Error.sendError(res, error);
        }
    }

    //OUT GROUP 
    async outChannel(req, res) {
        try {
            let userID = "67b548d821d36359846f8190";
            let channelID = "67bae576d278d1e7fdc6469e"
            const channel = await Channel.findById(channelID);
            if (!channel) {
                return Error.sendNotFound(res, "Not found channel")
            }

            const userExists = channel.members.some(member => member.user.toString() === userID);
            if (!userExists) {
                return Error.sendNotFound(res, "Not found user in members")
            }

            const updatedChannel = await Channel.findByIdAndUpdate(
                channelID,
                { $pull: { members: { user: userID } } },
                { new: true }
            );

            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                success: true,
                message: "User removed from channel successfully",
                members: updatedChannel.members,
            });
        } catch (error) {
            Error.sendError(res, error);
        }
    }

    // ASSIGN ROLE MEMBER
    async assignRoleMember(req, res) {
        try {
            let { userID, channelID, role } = req.body;
            role = role.trim();
            const channel = await Channel.findById(channelID);
            if (!channel) {
                return Error.sendNotFound(res, "Not found channel")
            }

            const memberIndex = channel.members.findIndex(member => member.user.toString() === userID);
            if (memberIndex === -1) {
                return Error.sendNotFound(res, "User not found in members");
            }

            // Cập nhật role mới
            if (!ROLE_MEMBER_OF_CHANNEL.includes(role)) {
                console.log("❌ Invalid role received:", role);
                return Error.sendError(res, "Invalid role");
            }

            channel.members[memberIndex].role = ROLE_MEMBER_OF_CHANNEL[1];
            await channel.save();
            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                success: true,
                user: channel.members[memberIndex]
            })

        } catch (error) {
            Error.sendError(res, error)
        }
    }

}

export default new ChannelController();