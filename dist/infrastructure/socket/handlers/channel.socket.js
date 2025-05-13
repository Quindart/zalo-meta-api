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
const eventEnum_1 = __importDefault(require("../../../constants/eventEnum"));
const container_1 = require("../../inversify/container");
const type_1 = __importDefault(require("../../inversify/type"));
const ROLE_TYPES = {
    CAPTAIN: 'captain',
    MEMBER: 'member',
    SUB_CAPTAIN: 'sub_captain'
};
class ChannelSocket {
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
        this.registerEvents();
        this.userService = container_1.container.get(type_1.default.UserService);
        this.messageService = container_1.container.get(type_1.default.MessageService);
        this.channelService = container_1.container.get(type_1.default.ChannelService);
    }
    registerEvents() {
        this.socket.on(eventEnum_1.default.CHANNEL.FIND_ORCREATE, this.findOrCreateChat.bind(this));
        this.socket.on(eventEnum_1.default.CHANNEL.FIND_BY_ID, this.findByIdChannel.bind(this));
        this.socket.on(eventEnum_1.default.CHANNEL.LOAD_CHANNEL, this.loadChannel.bind(this));
        this.socket.on(eventEnum_1.default.CHANNEL.CREATE, this.createChannel.bind(this));
        this.socket.on(eventEnum_1.default.CHANNEL.JOIN_ROOM, this.joinRoom.bind(this));
        this.socket.on(eventEnum_1.default.CHANNEL.LEAVE_ROOM, this.leaveRoom.bind(this));
        this.socket.on(eventEnum_1.default.CHANNEL.DISSOLVE_GROUP, this.dissolveGroup.bind(this));
        this.socket.on(eventEnum_1.default.CHANNEL.ADD_MEMBER, this.addMember.bind(this));
        this.socket.on(eventEnum_1.default.CHANNEL.REMOVE_MEMBER, this.removeMember.bind(this));
        this.socket.on(eventEnum_1.default.CHANNEL.ASSIGN_ROLE, this.assignRole.bind(this));
    }
    findOrCreateChat(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { senderId, receiverId } = params;
            const receiver = yield this.userRepo.findOne(receiverId);
            if (!receiver) {
                console.error("Receiver not found:", receiverId);
                return;
            }
            const nameChannel = receiver.lastName + receiver.firstName;
            const typeChannel = "personal";
            const avatarChannel = receiver.avatar || null;
            this.channelService.findOrCreateChannelPersonal(receiverId, senderId, nameChannel, typeChannel, avatarChannel)
                .then((channel) => {
                this.socket.emit(eventEnum_1.default.CHANNEL.FIND_ORCREATE_RESPONSE, {
                    success: true,
                    data: channel,
                    message: "Channel found or created successfully",
                });
            })
                .catch((error) => {
                console.error("Error finding or creating channel:", error);
            });
        });
    }
    findByIdChannel(params) {
        const { channelId, currentUserId } = params;
        this.channelService.getChannel(channelId, currentUserId)
            .then((channel) => {
            this.socket.emit(eventEnum_1.default.CHANNEL.FIND_BY_ID_RESPONSE, {
                success: true,
                data: channel,
                message: "Channel found successfully",
            });
        })
            .catch((error) => {
            console.error("Error finding channel:", error);
        });
    }
    loadChannel(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { currentUserId } = params;
            try {
                this.channelService.getChannels(currentUserId)
                    .then((channels) => {
                    this.socket.emit(eventEnum_1.default.CHANNEL.LOAD_CHANNEL_RESPONSE, {
                        success: true,
                        data: channels,
                        message: "Channels found successfully",
                    });
                })
                    .catch((error) => {
                    console.error("Error finding channels:", error);
                });
            }
            catch (error) {
                console.error("Error finding channels:", error);
                this.socket.emit(eventEnum_1.default.CHANNEL.LOAD_CHANNEL_RESPONSE, {
                    success: false,
                    message: "Failed to load channels",
                    error: error.message
                });
            }
        });
    }
    createChannel(params) {
        const { name, currentUserId, members } = params;
        this.channelService.createChannelSocket(name, currentUserId, members)
            .then((channel) => {
            const allMembers = [...members, currentUserId];
            allMembers.forEach((memberId) => {
                this.io.to(memberId).emit(eventEnum_1.default.CHANNEL.CREATE_RESPONSE, {
                    success: true,
                    data: channel,
                    message: "Channel created successfully",
                });
            });
        })
            .catch((error) => {
            console.error("Error creating channel:", error);
        });
    }
    joinRoom(params) {
        const { channelId, currentUserId } = params;
        Promise.all([
            this.messageService.getMessages(channelId, currentUserId),
            this.channelService.getChannel(channelId, currentUserId)
        ])
            .then(([messages, channel]) => {
            this.socket.emit(eventEnum_1.default.CHANNEL.JOIN_ROOM_RESPONSE, {
                success: true,
                data: {
                    channel: channel,
                    messages: messages
                },
                message: "Joined room successfully"
            });
            this.socket.join(channelId);
        })
            .catch((error) => {
            console.error("Error joining room:", error);
            this.socket.emit(eventEnum_1.default.CHANNEL.JOIN_ROOM_RESPONSE, {
                success: false,
                message: "Failed to join room",
                error: error.message
            });
        });
    }
    leaveRoom(params) {
        const { channelId, userId } = params;
        this.socket.leave(channelId);
        this.channelService.leaveChannel(channelId, userId)
            .then((result) => {
            const messageResponse = {
                content: result.data.content,
                sender: result.data.sender,
                members: result.data.members,
                channelId: result.data.channelId,
                status: result.data.status,
                timestamp: result.data.timestamp,
                isMe: result.data.isMe,
                messageType: result.data.messageType,
            };
            result.data.members.forEach((member) => {
                if (member.userId.toString() !== userId) {
                    this.io.to(member.userId).emit(eventEnum_1.default.MESSAGE.RECEIVED, messageResponse);
                }
            });
            this.socket.emit(eventEnum_1.default.CHANNEL.LEAVE_ROOM_RESPONSE, {
                success: true,
                message: "Left room successfully",
                data: {
                    id: channelId,
                }
            });
        })
            .catch((error) => {
            console.error("Error leaving room:", error);
            this.socket.emit(eventEnum_1.default.CHANNEL.LEAVE_ROOM_RESPONSE, {
                success: false,
                message: "Failed to leave room",
                error: error.message
            });
        });
    }
    removeMember(params) {
        const { channelId, senderId, userId } = params;
        this.channelService.removeMember(channelId, senderId, userId)
            .then((result) => {
            if (!result || !result.data) {
                throw new Error("Không nhận được dữ liệu từ removeMember");
            }
            const messageResponse = {
                content: result.data.content,
                sender: result.data.sender,
                members: result.data.members,
                channelId: result.data.channelId,
                status: result.data.status,
                timestamp: result.data.timestamp,
                isMe: result.data.isMe,
                messageType: result.data.messageType,
            };
            result.data.members.forEach((member) => {
                if (member.userId !== userId) {
                    this.io.to(member.userId).emit(eventEnum_1.default.MESSAGE.RECEIVED, messageResponse);
                    this.io.to(member.userId).emit(eventEnum_1.default.CHANNEL.REMOVE_MEMBER_RESPONSE, {
                        success: true,
                        message: "Remove member successfully",
                        data: result.data.channel,
                    });
                }
            });
        })
            .catch((error) => {
            console.error("Error leaving room:", error.message);
            this.socket.emit(eventEnum_1.default.CHANNEL.REMOVE_MEMBER_RESPONSE, {
                success: false,
                message: "Failed to remove member",
                error: error.message,
            });
        });
    }
    dissolveGroup(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { channelId, userId } = params;
            try {
                const result = yield this.channelService.dissolveGroup(channelId, userId);
                const messageResponse = {
                    content: result.data.content,
                    sender: result.data.sender,
                    members: result.data.members,
                    channelId: result.data.channelId,
                    status: result.data.status,
                    timestamp: result.data.timestamp,
                    isMe: result.data.isMe,
                    messageType: result.data.messageType,
                };
                result.data.members.forEach((member) => {
                    if (member.userId.toString() !== userId) {
                        this.io.to(member.userId).emit(eventEnum_1.default.CHANNEL.DISSOLVE_GROUP_RESPONSE_MEMBER, {
                            success: true,
                            message: "Group dissolved successfully",
                            data: {
                                channelId: channelId,
                                message: messageResponse,
                            }
                        });
                    }
                });
                this.socket.emit(eventEnum_1.default.CHANNEL.DISSOLVE_GROUP_RESPONSE, {
                    success: true,
                    message: "Group dissolved successfully",
                    data: {
                        id: channelId,
                    }
                });
            }
            catch (error) {
                console.error("Error dissolving group:", error);
                this.socket.emit(eventEnum_1.default.CHANNEL.DISSOLVE_GROUP_RESPONSE, {
                    success: false,
                    message: "Failed to dissolve group",
                    error: error.message
                });
            }
        });
    }
    addMember(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { channelId, userId } = params;
            try {
                const channel = yield this.channelService.addMemberToChannel(channelId, userId);
                channel.members.forEach((member) => {
                    this.io
                        .to(member.userId) // assume room by userId
                        .emit(eventEnum_1.default.CHANNEL.ADD_MEMBER_RESPONSE, {
                        success: true,
                        data: channel,
                        message: "Thêm thành viên thành công",
                    });
                });
            }
            catch (error) {
                console.error("Error adding member:", error);
                this.socket.emit(eventEnum_1.default.CHANNEL.ADD_MEMBER_RESPONSE, {
                    success: false,
                    message: error.message,
                });
            }
        });
    }
    assignRole(_a) {
        return __awaiter(this, arguments, void 0, function* ({ channelId, userId, targetUserId, newRole }) {
            try {
                const channel = yield this.channelService.getChannel(channelId, userId);
                const admin = channel.members.find((m) => m.userId.toString() === userId);
                const target = channel.members.find((m) => m.userId.toString() === targetUserId);
                if (!admin || ![ROLE_TYPES.CAPTAIN, ROLE_TYPES.SUB_CAPTAIN].includes(admin.role)) {
                    return this.socket.emit(eventEnum_1.default.CHANNEL.ASSIGN_ROLE, {
                        message: "Bạn không có quyền thay đổi vai trò.",
                    });
                }
                if (!target) {
                    return this.socket.emit(eventEnum_1.default.CHANNEL.ASSIGN_ROLE, {
                        message: "Thành viên không tồn tại trong nhóm.",
                    });
                }
                if (newRole === ROLE_TYPES.CAPTAIN) {
                    const currentCaptain = channel.members.find((m) => m.role === ROLE_TYPES.CAPTAIN && m.userId.toString() !== targetUserId);
                    if (currentCaptain) {
                        if (currentCaptain.userId.toString() !== userId) {
                            return this.socket.emit(eventEnum_1.default.CHANNEL.ASSIGN_ROLE, {
                                message: "Chỉ trưởng nhóm hiện tại mới có quyền chuyển giao.",
                            });
                        }
                        currentCaptain.role = ROLE_TYPES.MEMBER;
                    }
                }
                if (admin.role === ROLE_TYPES.SUB_CAPTAIN && newRole === ROLE_TYPES.CAPTAIN) {
                    return this.socket.emit(eventEnum_1.default.CHANNEL.ASSIGN_ROLE, {
                        message: "Phó nhóm không được gán trưởng nhóm.",
                    });
                }
                if (admin.userId.toString() === targetUserId && newRole === ROLE_TYPES.MEMBER) {
                    const subCaptainExists = channel.members.some((m) => m.role === ROLE_TYPES.SUB_CAPTAIN);
                    const memberExists = channel.members.some((m) => m.role === ROLE_TYPES.MEMBER);
                    if (!subCaptainExists && !memberExists) {
                        return this.socket.emit(eventEnum_1.default.CHANNEL.ASSIGN_ROLE, {
                            message: "Không thể rời chức captain vì không có phó nhóm hoặc member để thay thế.",
                        });
                    }
                }
                target.role = newRole;
                yield this.channelService.assignRoleChannelId(channel.id, channel.members);
                channel.members.forEach((member) => {
                    this.io.to(member.userId).emit(eventEnum_1.default.CHANNEL.ROLE_UPDATED, {
                        success: true,
                        data: channel,
                        message: "Thay đổi vai trò thành công",
                    });
                });
            }
            catch (err) {
                this.socket.emit(eventEnum_1.default.CHANNEL.ASSIGN_ROLE, {
                    message: "Đã có lỗi xảy ra.",
                });
            }
        });
    }
}
exports.default = ChannelSocket;
