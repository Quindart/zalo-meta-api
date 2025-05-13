"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.MongooseChannelRepository = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const channel_enum_1 = require("../../../types/enum/channel.enum");
const ChannelMapper_1 = require("../mappers/ChannelMapper");
const Channel_1 = __importDefault(require("../model/Channel"));
const User_1 = __importDefault(require("../model/User"));
const Message_1 = __importDefault(require("../model/Message"));
const SystemMessage_1 = __importDefault(require("../model/SystemMessage"));
const inversify_1 = require("inversify");
const type_1 = __importDefault(require("../../inversify/type"));
const MongooseBaseEntity_1 = require("./MongooseBaseEntity");
let MongooseChannelRepository = class MongooseChannelRepository {
    constructor(logger) {
        this.logger = logger;
        this._formatChannelMembersRequest = (members) => __awaiter(this, void 0, void 0, function* () {
            return members.map(mem => ({
                user: new mongoose_1.default.Types.ObjectId(mem.userId),
                role: mem.role,
            }));
        });
        this._baseRepository = new MongooseBaseEntity_1.MongooseBaseRepository();
    }
    //TODO: DONE
    toSave(document) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._baseRepository.toSave(document);
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { memberRequestId, userCreateId, nameChannel, typeChannel, avatarChannel } = data;
                const createMembers = [
                    { user: memberRequestId, role: channel_enum_1.ROLE_TYPES.MEMBER },
                    { user: userCreateId, role: channel_enum_1.ROLE_TYPES.MEMBER }
                ];
                const channel = yield Channel_1.default.create({
                    type: typeChannel,
                    members: createMembers,
                    name: nameChannel,
                    avatar: avatarChannel,
                    lastMessage: null,
                });
                return channel;
            }
            catch (error) {
                this.logger.error(error);
            }
            throw new Error("Method not implemented.");
        });
    }
    createChannelGroup(name, membersList) {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = new Channel_1.default({
                name,
                type: 'group',
                members: membersList,
                lastMessage: "",
                avatar: "https://i.pinimg.com/474x/c5/e7/30/c5e7305c0259beb7fc3d2f7ef3df6bb1.jpg",
            });
            yield channel.save();
            return channel;
        });
    }
    //TODO: get channel 
    getChannel(channelId, currentUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = new mongoose_1.default.Types.ObjectId(channelId);
            try {
                const channel = yield Channel_1.default.findById(id)
                    .populate({
                    path: "members.user",
                    select: "firstName lastName avatar email"
                })
                    .lean();
                if (!channel) {
                    throw new Error("Channel not found");
                }
                return yield this._formatChannelResponse(channel, currentUserId);
            }
            catch (error) {
                console.error("Error in getChannel:", error);
                throw error;
            }
        });
    }
    //TODO: get channes
    getChannels(currentUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const channels = yield Channel_1.default.aggregate([
                    {
                        $match: {
                            "members.user": new mongoose_1.Types.ObjectId(currentUserId),
                            "deletedForUsers.user": { $nin: [new mongoose_1.Types.ObjectId(currentUserId)] },
                            "$and": [
                                // { deletedAt: null },
                                { lastMessage: { $ne: null } }
                            ]
                        }
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
                return Promise.all(channels.map(channel => this._formatChannelResponse(channel, currentUserId)));
            }
            catch (error) {
                console.error('Error fetching channels:', error);
                throw error;
            }
        });
    }
    //TODO: FIND
    findOne(id, queries) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const idObj = new mongoose_1.Types.ObjectId(id);
                const channel = yield Channel_1.default.findById(idObj);
                this.logger.info(`${JSON.stringify(channel)}`);
                return channel;
            }
            catch (error) {
                this.logger.error(error);
            }
        });
    }
    findChannelByTypeAndByMemberIds(type, memberId, creatorChannelId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const memberIds = [
                    new mongoose_1.Types.ObjectId(memberId),
                    new mongoose_1.Types.ObjectId(creatorChannelId)
                ];
                let channel = yield Channel_1.default.findOne({
                    type: type,
                    members: {
                        $all: memberIds.map(id => ({ $elemMatch: { user: id } })),
                        $size: 2
                    }
                });
                return channel;
            }
            catch (error) {
                console.log("💲💲💲 ~ MongooseChannelRepository ~ findChannelByTypeAndByMemberIds ~ error:", error);
            }
        });
    }
    findAll(queries) {
        throw new Error("Method not implemented.");
    }
    update(id, data) {
        throw new Error("Method not implemented.");
    }
    delete(id) {
        throw new Error("Method not implemented.");
    }
    // TODO DONE
    findOrCreateChannelPersonal(memberRequestId, userCreateId, nameChannel, typeChannel, avatarChannel) {
        return __awaiter(this, void 0, void 0, function* () {
            const memberIds = [
                new mongoose_1.Types.ObjectId(memberRequestId),
                new mongoose_1.Types.ObjectId(userCreateId)
            ];
            let channel = yield Channel_1.default.findOne({
                type: typeChannel,
                members: {
                    $all: memberIds.map(id => ({ $elemMatch: { user: id } })),
                    $size: 2
                }
            });
            if (!channel) {
                const createMembers = [
                    { user: memberRequestId, role: channel_enum_1.ROLE_TYPES.MEMBER },
                    { user: userCreateId, role: channel_enum_1.ROLE_TYPES.MEMBER }
                ];
                channel = yield Channel_1.default.create({
                    type: typeChannel,
                    members: createMembers,
                    name: nameChannel,
                    avatar: avatarChannel,
                    lastMessage: null,
                });
            }
            return this._formatChannelResponse(channel);
        });
    }
    //TODO: DONE
    findChannelByIdAndByUserId(channelId, currentUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const channel = yield Channel_1.default.findById(channelId)
                    .populate({
                    path: "members.user",
                    select: "firstName lastName avatar email"
                });
                if (!channel) {
                    throw new Error("Channel not found");
                }
                return channel;
            }
            catch (error) {
                console.error("Error in getChannel:", error);
                throw error;
            }
        });
    }
    ;
    createChannelSocket(name, currentUserId, members) {
        return __awaiter(this, void 0, void 0, function* () {
            const creatorId = currentUserId;
            const membersList = this._createMembersOfChannel(creatorId, members);
            const channel = new Channel_1.default({
                name,
                type: 'group',
                members: membersList,
                lastMessage: "",
                avatar: "https://i.pinimg.com/474x/c5/e7/30/c5e7305c0259beb7fc3d2f7ef3df6bb1.jpg",
            });
            // TẠO LASTMESSAGE TRONG CHANNEL
            const systemMessage = new SystemMessage_1.default({
                actionType: "channel_created",
            });
            const lastMessage = new Message_1.default({
                senderId: creatorId,
                content: "Welcome to the group!",
                status: "sent",
                channelId: channel._id,
                messageType: channel_enum_1.MESSAGE_TYPES.SYSTEM,
                systemMessageId: systemMessage._id,
            });
            systemMessage.messageId = lastMessage._id;
            channel.lastMessage = lastMessage._id;
            yield lastMessage.save();
            yield systemMessage.save();
            yield channel.save();
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
        });
    }
    //? Nằm ở userService
    updateUserChannelSocket(channel) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!channel)
                return;
            const memberIds = channel.members.map((member) => member.user);
            const updatePromises = memberIds.map((memberId) => User_1.default.findByIdAndUpdate(memberId, {
                $addToSet: { channels: channel._id },
                updatedAt: Date.now()
            }, { new: true }));
            yield Promise.all(updatePromises);
        });
    }
    ;
    //TODO: DONE
    assignRoleChannelIdSocket(channelId, updatedMembers) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!channelId || !Array.isArray(updatedMembers)) {
                return;
            }
            const formattedMembers = yield this._formatChannelMembersRequest(updatedMembers);
            yield Channel_1.default.findByIdAndUpdate(channelId, {
                $set: {
                    members: formattedMembers,
                    updatedAt: Date.now(),
                },
            }, { new: true });
        });
    }
    //TODO: DONE -> to remove
    updateLastMessageSocket(channelId, lastMessageId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!channelId || !lastMessageId)
                return null;
            const channel = yield Channel_1.default.findById(new mongoose_1.default.Types.ObjectId(channelId));
            if (!channel)
                return null;
            channel.lastMessage = lastMessageId;
            channel.updatedAt = new Date(Date.now());
            channel.deletedForUsers = [];
            const updatedChannel = yield channel.save();
            return updatedChannel;
        });
    }
    //TODO: Need tách service
    removeMemberSocket(channelId, senderId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!channelId || !userId || !senderId) {
                    throw new Error('Channel ID, Sender ID và User ID là bắt buộc');
                }
                const channelObjectId = new mongoose_1.Types.ObjectId(channelId);
                const userObjectId = new mongoose_1.Types.ObjectId(userId);
                const senderObjectId = new mongoose_1.Types.ObjectId(senderId);
                const channel = yield Channel_1.default.findById(channelObjectId);
                if (!channel)
                    throw new Error('Channel không tồn tại');
                const senderIndex = channel.members.findIndex(member => member.user.toString() === senderObjectId.toString());
                const userIndex = channel.members.findIndex(member => member.user.toString() === userObjectId.toString());
                if (senderIndex === -1 || userIndex === -1) {
                    throw new Error('Người gửi hoặc người cần xóa không nằm trong channel');
                }
                const sender = yield User_1.default.findById(senderObjectId);
                const user = yield User_1.default.findById(userObjectId);
                if (![channel_enum_1.ROLE_TYPES.CAPTAIN, channel_enum_1.ROLE_TYPES.SUB_CAPTAIN].includes(channel.members[senderIndex].role)) {
                    throw new Error('Bạn không có quyền xóa thành viên');
                }
                const userRole = channel.members[userIndex].role;
                channel.members.splice(userIndex, 1);
                if (channel.members.length === 0) {
                    channel.deletedAt = new Date();
                }
                else if (userRole === channel_enum_1.ROLE_TYPES.CAPTAIN) {
                    channel.members[0].role = channel_enum_1.ROLE_TYPES.CAPTAIN;
                }
                const systemMessage = new SystemMessage_1.default({ actionType: "member_removed" });
                const leaveMessage = new Message_1.default({
                    senderId: senderObjectId,
                    content: `${sender.firstName} ${sender.lastName} removed ${user.firstName} ${user.lastName} from group`,
                    status: "system",
                    channelId: channelObjectId,
                    messageType: channel_enum_1.MESSAGE_TYPES.SYSTEM,
                    systemMessageId: systemMessage._id,
                });
                systemMessage.messageId = leaveMessage._id;
                channel.lastMessage = leaveMessage._id;
                yield leaveMessage.save();
                yield systemMessage.save();
                yield channel.save();
                yield User_1.default.findByIdAndUpdate(userObjectId, { $pull: { channels: channelObjectId } });
                return {
                    success: true,
                    data: {
                        messageType: channel_enum_1.MESSAGE_TYPES.SYSTEM,
                        content: `${user.lastName} ${user.firstName} has been removed from the channel`,
                        sender: {
                            id: userObjectId,
                            name: `${user.lastName} ${user.firstName}`,
                            avatar: user.avatar,
                        },
                        members: channel.members.map(member => ({
                            userId: member.user.toString(),
                            role: member.role
                        })),
                        channelId: channelObjectId,
                        channel: this._formatChannelResponse(channel),
                        status: "send",
                        timestamp: new Date(),
                        isMe: true,
                    }
                };
            }
            catch (error) {
                throw new Error(error.message || "Đã có lỗi xảy ra khi xóa thành viên");
            }
        });
    }
    ;
    //TODO: Need tách service
    addMemberToChannelSocket(channelId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!channelId || !userId) {
                throw new Error("Channel ID và User ID là bắt buộc");
            }
            const channelObjectId = new mongoose_1.Types.ObjectId(channelId);
            const userObjectId = new mongoose_1.Types.ObjectId(userId);
            // 1. Tìm channel
            const channel = yield Channel_1.default.findById(channelObjectId);
            if (!channel) {
                throw new Error("Channel không tồn tại");
            }
            // 2. Kiểm tra nếu user đã trong nhóm thì không thêm nữa
            const alreadyMember = channel.members.some(member => member.user.toString() === userObjectId.toString());
            if (alreadyMember) {
                throw new Error("User đã là thành viên của nhóm");
            }
            // 3. Thêm vào members với role MEMBER
            channel.members.push({
                user: userObjectId,
                role: channel_enum_1.ROLE_TYPES.MEMBER
            });
            // 4. Cập nhật updatedAt
            channel.updatedAt = Date.now();
            // 5. Lưu channel
            yield channel.save();
            // 6. Cập nhật mảng channels trong User (nếu cần)
            yield User_1.default.findByIdAndUpdate(userObjectId, { $addToSet: { channels: channelObjectId }, updatedAt: Date.now() });
            // 7. Trả về channel đã format
            return this._formatChannelResponse(channel, userId);
        });
    }
    ;
    dissolveGroupSocket(channelId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!channelId || !userId) {
                    throw new Error('Channel ID and User ID are required');
                }
                const channelObjectId = new mongoose_1.Types.ObjectId(channelId);
                const userObjectId = new mongoose_1.Types.ObjectId(userId);
                const user = yield User_1.default.findById(userObjectId);
                if (!user) {
                    throw new Error('User not found');
                }
                // Check if the user is the captain of the channel
                const channel = yield Channel_1.default.findById(channelObjectId);
                if (!channel) {
                    throw new Error('Channel not found');
                }
                const memberIndex = channel.members.findIndex(member => member.user.toString() === userObjectId.toString());
                const member = channel.members.find(member => member.user.toString() === userObjectId.toString());
                if (!member || member.role !== channel_enum_1.ROLE_TYPES.CAPTAIN) {
                    throw new Error('Only the captain can dissolve the group');
                }
                const systemMessage = new SystemMessage_1.default({
                    actionType: "group_dissolved",
                });
                const dissolveMessage = new Message_1.default({
                    senderId: userObjectId,
                    content: `Trưởng nhóm ${user.lastName} ${user.firstName} đã giải tán nhóm`,
                    status: "system",
                    channelId: channelObjectId,
                    messageType: channel_enum_1.MESSAGE_TYPES.SYSTEM,
                    systemMessageId: systemMessage._id,
                });
                systemMessage.messageId = dissolveMessage._id;
                channel.lastMessage = dissolveMessage._id;
                channel.deletedAt = new Date();
                channel.isDeleted = true;
                channel.members.splice(memberIndex, 1);
                yield systemMessage.save();
                yield dissolveMessage.save();
                yield channel.save();
                yield User_1.default.findByIdAndUpdate(userObjectId, { $pull: { channels: channelObjectId } });
                return {
                    success: true,
                    message: 'Group dissolved successfully',
                    data: {
                        messageType: channel_enum_1.MESSAGE_TYPES.SYSTEM,
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
            }
            catch (error) {
                console.error('Error in dissolveGroup:', error);
                throw error;
            }
        });
    }
    ;
    leaveChannelSocket(channelId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!channelId || !userId) {
                    throw new Error('Channel ID and User ID are required');
                }
                const channelObjectId = new mongoose_1.Types.ObjectId(channelId);
                const userObjectId = new mongoose_1.Types.ObjectId(userId);
                const channel = yield Channel_1.default.findById(channelObjectId);
                if (!channel) {
                    throw new Error('Channel not found');
                }
                const memberIndex = channel.members.findIndex(member => member.user.toString() === userObjectId.toString());
                if (memberIndex === -1) {
                    throw new Error('User is not a member of this channel');
                }
                const userRole = channel.members[memberIndex].role;
                const user = yield User_1.default.findById(userObjectId);
                if (!user) {
                    throw new Error('User not found');
                }
                if (channel.type === 'personal') {
                    channel.deletedAt = new Date();
                    yield channel.save();
                }
                else {
                    channel.members.splice(memberIndex, 1);
                    if (channel.members.length === 0) {
                        channel.deletedAt = new Date();
                    }
                    else if (userRole === channel_enum_1.ROLE_TYPES.CAPTAIN && channel.members.length > 0) {
                        channel.members[0].role = channel_enum_1.ROLE_TYPES.CAPTAIN;
                    }
                    const systemMessage = new SystemMessage_1.default({
                        actionType: "member_removed",
                    });
                    const leaveMessage = new Message_1.default({
                        senderId: userObjectId,
                        content: `${user.firstName} ${user.lastName} has left the channel`,
                        status: "system",
                        channelId: channelObjectId,
                        messageType: channel_enum_1.MESSAGE_TYPES.SYSTEM,
                        systemMessageId: systemMessage._id,
                    });
                    systemMessage.messageId = leaveMessage._id;
                    channel.lastMessage = leaveMessage._id;
                    yield leaveMessage.save();
                    yield systemMessage.save();
                    yield channel.save();
                }
                yield User_1.default.findByIdAndUpdate(userObjectId, { $pull: { channels: channelObjectId } });
                return {
                    success: true,
                    message: 'Successfully left the channel',
                    data: {
                        messageType: channel_enum_1.MESSAGE_TYPES.SYSTEM,
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
            }
            catch (error) {
                console.error('Error in leaveChannel:', error);
                throw error;
            }
        });
    }
    ;
    findChannelsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const channels = yield Channel_1.default.find({
                "members.user": userId
            });
            const mapper = new ChannelMapper_1.ChannelMapper();
            return channels.map(channel => mapper.toDomain(channel));
        });
    }
    //TODO: Private function
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
    _getOtherMembersInfo(channel, currentUserId) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    _generateGroupAvatar(members) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!members || members.length < 2) {
                    return ["https://i.pinimg.com/474x/c5/e7/30/c5e7305c0259beb7fc3d2f7ef3df6bb1.jpg"];
                }
                const memberIds = members.slice(0, 3).map(member => typeof member.user === 'object' ? member.user : member.user);
                const users = yield User_1.default.find({
                    _id: { $in: memberIds }
                }).select('avatar').lean();
                if (!users || users.length === 0) {
                    return ["https://i.pinimg.com/474x/c5/e7/30/c5e7305c0259beb7fc3d2f7ef3df6bb1.jpg"];
                }
                const avatars = users
                    .filter(user => user.avatar)
                    .map(user => user.avatar)
                    .slice(0, 3);
                return avatars;
            }
            catch (error) {
                console.error('Error generating group avatar:', error);
                return ["https://i.pinimg.com/474x/c5/e7/30/c5e7305c0259beb7fc3d2f7ef3df6bb1.jpg"];
            }
        });
    }
    _formatChannelResponse(channel, currentUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            let name = channel.name;
            let avatar = channel.avatar;
            let avatarGroup = channel.avatar;
            if (channel.type === 'personal') {
                const otherMember = this._getOtherMembersInfo(channel, currentUserId)[0];
                if (otherMember) {
                    name = `${otherMember.lastName} ${otherMember.firstName}`;
                    avatar = otherMember.avatar;
                }
            }
            else {
                avatarGroup = yield this._generateGroupAvatar(channel.members);
            }
            return {
                id: channel._id.toString(),
                name: name,
                avatar: avatar,
                avatarGroup: avatarGroup,
                type: channel.type,
                members: channel.members.map(member => ({
                    userId: member.user._id.toString() || member.user,
                    role: member.role
                })),
                time: channel.lastMessage ? channel.lastMessage.createdAt : null,
                message: channel.lastMessage ? channel.lastMessage.content : null,
                deletedForUsers: channel.deletedForUsers && channel.deletedForUsers.map(user => user.user.toString()),
                isDeleted: channel.isDeleted,
            };
        });
    }
};
exports.MongooseChannelRepository = MongooseChannelRepository;
exports.MongooseChannelRepository = MongooseChannelRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(type_1.default.Logger)),
    __metadata("design:paramtypes", [Object])
], MongooseChannelRepository);
