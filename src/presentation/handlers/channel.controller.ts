import { Request, Response } from "express";
import { HTTP_STATUS } from "../../constants/index";
import Channel from "../../infrastructure/mongo/model/Channel"
import Error from "../../utils/errors"
import { ROLE_MEMBER_OF_CHANNEL } from "../../constants/index"
import TYPES from "../../infrastructure/inversify/type";
import { IChannelService } from "../../application/interfaces/services/IChannelService";
import { container } from "../../infrastructure/inversify/container";
import { ROLE_TYPES } from "../../types/enum/channel.enum";
import { RequestUser } from "../../types/request/RequestUser";

class ChannelController {

    private channelService: IChannelService
    constructor() {
        this.channelService = container.get<IChannelService>(TYPES.ChannelService)
    }
    //TODO: CREATE CHANNEl
    async createGroup(req: RequestUser, res: Response): Promise<void> {
        try {
            const { name, members } = req.body;
            const userCreateChannelId = req.user.id

            //TODO: đây là mảng members
            let createMembers = this._createMembersOfChannel(members, userCreateChannelId)

            const channel = await Channel.create({ name, members: createMembers });

            if (!channel) {
                Error.sendError(res, 'Failed to create channel')
            }

            //TODO: Lưu ds channel vào trong list member user
            await this.channelService.updateUserChannel(channel)

            res.status(HTTP_STATUS.CREATED).json({
                status: HTTP_STATUS.CREATED,
                success: true,
                message: "Create channel success",
                channel
            })

        } catch (error) {
            Error.sendError(res, error)
        }
    }

    //TODO: GET ALL CHANNEL
    async getAllChannel(req: RequestUser, res: Response): Promise<void> {
        try {
            const userId = req.user.id;
            const channels = await Channel.find({
                "members.user": userId
            }).lean();
            res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                success: true,
                message: "Get all channel success",
                channels,
                params: {
                    total: channels.length
                }
            })
        } catch (error) {
            Error.sendError(res, error);
        }
    }

    //TODO: GET CHANNEL BY ID
    async getChannelByID(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const channel = await Channel.findById(id).lean();
            if (!channel) {
                Error.sendNotFound(res, "Not found channel")
            }
            res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                success: true,
                message: "Get channel success",
                channel,
                totalMembers: channel.members.length

            })
        } catch (error) {
            Error.sendError(res, error);
        }
    }

    // ADD MEMBER TO CHANNEL BY GROUPID
    async addMemberToChannel(req: Request, res: Response): Promise<void> {
        try {
            let { id } = req.params
            const { userId } = req.body;
            const updatedChannel = await Channel.findByIdAndUpdate(
                id,
                { $push: { members: { user: userId, role: ROLE_MEMBER_OF_CHANNEL[2] } } },
                { new: true, select: '_id', lean: true }
            );
            if (!updatedChannel) {
                Error.sendNotFound(res, "Not found channel")
            }
            res.status(HTTP_STATUS.CREATED).json({
                status: HTTP_STATUS.CREATED,
                success: true,
                message: "Add member to channel success",

            })
        } catch (error) {
            Error.sendError(res, error);
        }
    }

    // GET ALL MEMBER OF CHANNEL BY channelId
    async getAllMember(req: Request, res: Response): Promise<void> {
        try {
            let { id } = req.params;
            const members = await Channel.findById(id).populate({
                path: 'members.user',
                select: "role avatar firstName lastName phone _id"
            }).select({ members: 1, _id: 0 }).lean();

            if (!members) {
                Error.sendNotFound(res, "Not found channel")
            }
            res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                success: true,
                message: "Get all members of channel success",
                ...members,
                totalMembers: Array.isArray(members.members) ? members.members.length : 0
            });
        } catch (error) {
            Error.sendError(res, error);
        }
    }

    //OUT GROUP 
    async outChannel(req: RequestUser, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const channel = await Channel.findById(id).lean();
            if (!channel) {
                Error.sendNotFound(res, "Channel not found");
            }
            const memberIndex = channel.members.findIndex(member => member.user.toString() === userId);
            if (memberIndex === -1) {
                Error.sendNotFound(res, "User not in channel");
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

            res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                success: true,
                message: "User removed from channel successfully",
                members: updatedChannel.members,
                totalMembers: updatedChannel.members.length
            });

        } catch (error) {
            Error.sendError(res, error);
        }
    }

    // ASSIGN ROLE MEMBER
    async assignRoleMember(req: Request, res: Response): Promise<void> {
        try {
            let { id } = req.params
            let { userId, role } = req.body;

            role = role.trim();
            if (!ROLE_MEMBER_OF_CHANNEL.includes(role)) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
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
            res.status(HTTP_STATUS.CREATED).json({
                status: HTTP_STATUS.CREATED,
                success: true,
                message: "Role assigned successfully",
                user: updatedChannel.members.find(m => m.user.toString() === userId),
            })

        } catch (error) {
            Error.sendError(res, error)
        }
    }
    private _createMembersOfChannel(creatorId: string, members: string[]) {
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

export default new ChannelController();
