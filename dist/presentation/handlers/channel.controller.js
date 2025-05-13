"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../constants/index");
const Channel_1 = __importDefault(require("../../infrastructure/mongo/model/Channel"));
const errors_1 = __importDefault(require("../../utils/errors"));
const index_2 = require("../../constants/index");
const type_1 = __importDefault(require("../../infrastructure/inversify/type"));
const container_1 = require("../../infrastructure/inversify/container");
const channel_enum_1 = require("../../types/enum/channel.enum");
class ChannelController {
    constructor() {
        this.channelService = container_1.container.get(type_1.default.ChannelService);
    }
    //TODO: CREATE CHANNEl
    createGroup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, members } = req.body;
                const userCreateChannelId = req.user.id;
                //TODO: đây là mảng members
                let createMembers = this._createMembersOfChannel(members, userCreateChannelId);
                const channel = yield Channel_1.default.create({ name, members: createMembers });
                if (!channel) {
                    errors_1.default.sendError(res, 'Failed to create channel');
                }
                //TODO: Lưu ds channel vào trong list member user
                yield this.channelService.updateUserChannel(channel);
                res.status(index_1.HTTP_STATUS.CREATED).json({
                    status: index_1.HTTP_STATUS.CREATED,
                    success: true,
                    message: "Create channel success",
                    channel
                });
            }
            catch (error) {
                errors_1.default.sendError(res, error);
            }
        });
    }
    //TODO: GET ALL CHANNEL
    getAllChannel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const channels = yield Channel_1.default.find({
                    "members.user": userId
                }).lean();
                res.status(index_1.HTTP_STATUS.OK).json({
                    status: index_1.HTTP_STATUS.OK,
                    success: true,
                    message: "Get all channel success",
                    channels,
                    params: {
                        total: channels.length
                    }
                });
            }
            catch (error) {
                errors_1.default.sendError(res, error);
            }
        });
    }
    //TODO: GET CHANNEL BY ID
    getChannelByID(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const channel = yield Channel_1.default.findById(id).lean();
                if (!channel) {
                    errors_1.default.sendNotFound(res, "Not found channel");
                }
                res.status(index_1.HTTP_STATUS.OK).json({
                    status: index_1.HTTP_STATUS.OK,
                    success: true,
                    message: "Get channel success",
                    channel,
                    totalMembers: channel.members.length
                });
            }
            catch (error) {
                errors_1.default.sendError(res, error);
            }
        });
    }
    // ADD MEMBER TO CHANNEL BY GROUPID
    addMemberToChannel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { id } = req.params;
                const { userId } = req.body;
                const updatedChannel = yield Channel_1.default.findByIdAndUpdate(id, { $push: { members: { user: userId, role: index_2.ROLE_MEMBER_OF_CHANNEL[2] } } }, { new: true, select: '_id', lean: true });
                if (!updatedChannel) {
                    errors_1.default.sendNotFound(res, "Not found channel");
                }
                res.status(index_1.HTTP_STATUS.CREATED).json({
                    status: index_1.HTTP_STATUS.CREATED,
                    success: true,
                    message: "Add member to channel success",
                });
            }
            catch (error) {
                errors_1.default.sendError(res, error);
            }
        });
    }
    // GET ALL MEMBER OF CHANNEL BY channelId
    getAllMember(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { id } = req.params;
                const members = yield Channel_1.default.findById(id).populate({
                    path: 'members.user',
                    select: "role avatar firstName lastName phone _id"
                }).select({ members: 1, _id: 0 }).lean();
                if (!members) {
                    errors_1.default.sendNotFound(res, "Not found channel");
                }
                res.status(index_1.HTTP_STATUS.OK).json(Object.assign(Object.assign({ status: index_1.HTTP_STATUS.OK, success: true, message: "Get all members of channel success" }, members), { totalMembers: Array.isArray(members.members) ? members.members.length : 0 }));
            }
            catch (error) {
                errors_1.default.sendError(res, error);
            }
        });
    }
    //OUT GROUP 
    outChannel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const userId = req.user.id;
                const channel = yield Channel_1.default.findById(id).lean();
                if (!channel) {
                    errors_1.default.sendNotFound(res, "Channel not found");
                }
                const memberIndex = channel.members.findIndex(member => member.user.toString() === userId);
                if (memberIndex === -1) {
                    errors_1.default.sendNotFound(res, "User not in channel");
                }
                const memberRole = channel.members[memberIndex].role;
                //CASE CAPTAIN ROLE
                if (memberRole === index_2.ROLE_MEMBER_OF_CHANNEL[0]) {
                    const coCaptainIndex = channel.members.findIndex(m => m.role === index_2.ROLE_MEMBER_OF_CHANNEL[1]);
                    if (coCaptainIndex !== -1) {
                        channel.members[coCaptainIndex].role = index_2.ROLE_MEMBER_OF_CHANNEL[0];
                    }
                    else {
                        const newCaptainIndex = channel.members.findIndex(m => m.user.toString() !== userId);
                        if (newCaptainIndex !== -1) {
                            channel.members[newCaptainIndex].role = index_2.ROLE_MEMBER_OF_CHANNEL[0];
                        }
                    }
                }
                // Remove user
                channel.members.splice(memberIndex, 1);
                const updatedChannel = yield Channel_1.default.findByIdAndUpdate(id, { $set: { members: channel.members } }, { new: true, lean: true });
                res.status(index_1.HTTP_STATUS.OK).json({
                    status: index_1.HTTP_STATUS.OK,
                    success: true,
                    message: "User removed from channel successfully",
                    members: updatedChannel.members,
                    totalMembers: updatedChannel.members.length
                });
            }
            catch (error) {
                errors_1.default.sendError(res, error);
            }
        });
    }
    // ASSIGN ROLE MEMBER
    assignRoleMember(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { id } = req.params;
                let { userId, role } = req.body;
                role = role.trim();
                if (!index_2.ROLE_MEMBER_OF_CHANNEL.includes(role)) {
                    res.status(index_1.HTTP_STATUS.BAD_REQUEST).json({
                        status: index_1.HTTP_STATUS.BAD_REQUEST,
                        success: false,
                        message: "Invalid role"
                    });
                }
                const updatedChannel = yield Channel_1.default.findOneAndUpdate({ _id: id, "members.user": userId }, { $set: { "members.$.role": role } }, { new: true, select: "members", lean: true });
                if (!updatedChannel) {
                    errors_1.default.sendNotFound(res, "Channel not found or user not in channel");
                }
                res.status(index_1.HTTP_STATUS.CREATED).json({
                    status: index_1.HTTP_STATUS.CREATED,
                    success: true,
                    message: "Role assigned successfully",
                    user: updatedChannel.members.find(m => m.user.toString() === userId),
                });
            }
            catch (error) {
                errors_1.default.sendError(res, error);
            }
        });
    }
    _createMembersOfChannel(creatorId, members) {
        if (members.length >= 2) {
            return [
                { user: creatorId, role: channel_enum_1.ROLE_TYPES.CAPTAIN },
                ...members.map(memberId => ({
                    user: memberId,
                    role: channel_enum_1.ROLE_TYPES.MEMBER
                }))
            ];
        }
        return members.map(memberId => ({
            user: memberId,
            role: channel_enum_1.ROLE_TYPES.MEMBER
        }));
    }
}
exports.default = new ChannelController();
