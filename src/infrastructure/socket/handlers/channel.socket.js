import SOCKET_EVENTS from "../../../constants/eventEnum.js";
import channelRepository from "../../../domain/repository/Channel.repository.js";
import messageRepository from "../../../domain/repository/Message.repository.js";
import { UserRepository } from "../../../domain/repository/User.repository.js";

const ROLE_TYPES = {
    CAPTAIN: 'captain',
    MEMBER: 'member',
    SUB_CAPTAIN: 'sub_captain'
};
class ChannelSocket {
    userRepo
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
        this.registerEvents();
        this.userRepo = new UserRepository()
    }

    registerEvents() {
        this.socket.on(SOCKET_EVENTS.CHANNEL.FIND_ORCREATE, this.findOrCreateChat.bind(this));
        this.socket.on(SOCKET_EVENTS.CHANNEL.FIND_BY_ID, this.findByIdChannel.bind(this));
        this.socket.on(SOCKET_EVENTS.CHANNEL.LOAD_CHANNEL, this.loadChannel.bind(this));
        this.socket.on(SOCKET_EVENTS.CHANNEL.CREATE, this.createChannel.bind(this));
        this.socket.on(SOCKET_EVENTS.CHANNEL.JOIN_ROOM, this.joinRoom.bind(this));
        this.socket.on(SOCKET_EVENTS.CHANNEL.LEAVE_ROOM, this.leaveRoom.bind(this));
        this.socket.on(SOCKET_EVENTS.CHANNEL.DISSOLVE_GROUP, this.dissolveGroup.bind(this));
        this.socket.on(SOCKET_EVENTS.CHANNEL.ADD_MEMBER, this.addMember.bind(this));
        this.socket.on(SOCKET_EVENTS.CHANNEL.REMOVE_MEMBER, this.removeMember.bind(this));
        this.socket.on(SOCKET_EVENTS.CHANNEL.ASSIGN_ROLE, this.assignRole.bind(this));

    }

    async findOrCreateChat(params) {
        const { senderId, receiverId } = params;

        const receiver = await this.userRepo.findOne(receiverId);
        if (!receiver) {
            console.error("Receiver not found:", receiverId);
            return;
        }
        const nameChannel = receiver.lastName + receiver.firstName;
        const typeChannel = "personal";
        const avatarChannel = receiver.avatar || null;


        channelRepository.findOrCreateChannel(receiverId, senderId, nameChannel, typeChannel, avatarChannel)
            .then((channel) => {
                this.socket.emit(SOCKET_EVENTS.CHANNEL.FIND_ORCREATE_RESPONSE, {
                    success: true,
                    data: channel,
                    message: "Channel found or created successfully",
                });
            })
            .catch((error) => {
                console.error("Error finding or creating channel:", error);
            });
    }

    findByIdChannel(params) {
        const { channelId, currentUserId } = params;
        channelRepository.getChannel(channelId, currentUserId)
            .then((channel) => {
                this.socket.emit(SOCKET_EVENTS.CHANNEL.FIND_BY_ID_RESPONSE, {
                    success: true,
                    data: channel,
                    message: "Channel found successfully",
                });
            })
            .catch((error) => {
                console.error("Error finding channel:", error);
            });
    }

    async loadChannel(params) {
        const { currentUserId } = params;
        try {
            console.log("Loading channels for user:", currentUserId);
            channelRepository.getChannels(currentUserId)
                .then((channels) => {
                    this.socket.emit(SOCKET_EVENTS.CHANNEL.LOAD_CHANNEL_RESPONSE, {
                        success: true,
                        data: channels,
                        message: "Channels found successfully",
                    });
                })
                .catch((error) => {
                    console.error("Error finding channels:", error);
                });
        } catch (error) {
            console.error("Error finding channels:", error);
            this.socket.emit(SOCKET_EVENTS.CHANNEL.LOAD_CHANNEL_RESPONSE, {
                success: false,
                message: "Failed to load channels",
                error: error.message
            });
        }
    }

    createChannel(params) {
        const { name, currentUserId, members } = params;
        channelRepository.createChannel(name, currentUserId, members)
            .then((channel) => {
                const allMembers = [...members, currentUserId];
                allMembers.forEach((memberId) => {
                    this.io.to(memberId).emit(SOCKET_EVENTS.CHANNEL.CREATE_RESPONSE, {
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
            messageRepository.getMessages(channelId, currentUserId),
            channelRepository.getChannel(channelId, currentUserId)
        ])
            .then(([messages, channel]) => {
                this.socket.emit(SOCKET_EVENTS.CHANNEL.JOIN_ROOM_RESPONSE, {
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
                this.socket.emit(SOCKET_EVENTS.CHANNEL.JOIN_ROOM_RESPONSE, {
                    success: false,
                    message: "Failed to join room",
                    error: error.message
                });
            });
    }

    leaveRoom(params) {
        const { channelId, userId } = params;
        this.socket.leave(channelId);
        channelRepository.leaveChannel(channelId, userId)
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
                        this.io.to(member.userId).emit(SOCKET_EVENTS.MESSAGE.RECEIVED, messageResponse);
                    }
                })

                this.socket.emit(SOCKET_EVENTS.CHANNEL.LEAVE_ROOM_RESPONSE, {
                    success: true,
                    message: "Left room successfully",
                    data: {
                        id: channelId,
                    }
                });
            })
            .catch((error) => {
                console.error("Error leaving room:", error);
                this.socket.emit(SOCKET_EVENTS.CHANNEL.LEAVE_ROOM_RESPONSE, {
                    success: false,
                    message: "Failed to leave room",
                    error: error.message
                });
            });
    }

    removeMember(params) {
        const { channelId, senderId, userId } = params;
        // this.io.to(userId).socketsLeave(channelId);

        channelRepository.removeMember(channelId, senderId, userId)
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
                        this.io.to(member.userId).emit(SOCKET_EVENTS.MESSAGE.RECEIVED, messageResponse);
                        this.io.to(member.userId).emit(SOCKET_EVENTS.CHANNEL.REMOVE_MEMBER_RESPONSE, {
                            success: true,
                            message: "Remove member successfully",
                            data: result.data.channel,
                        });
                    }
                });
            })
            .catch((error) => {
                console.error("Error leaving room:", error.message);
                this.socket.emit(SOCKET_EVENTS.CHANNEL.REMOVE_MEMBER_RESPONSE, {
                    success: false,
                    message: "Failed to remove member",
                    error: error.message,
                });
            });
    }




    async dissolveGroup(params) {
        const { channelId, userId } = params;
        try {
            const result = await channelRepository.dissolveGroup(channelId, userId);
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
                    this.io.to(member.userId).emit(SOCKET_EVENTS.MESSAGE.RECEIVED, messageResponse);
                }
            })
            this.socket.emit(SOCKET_EVENTS.CHANNEL.DISSOLVE_GROUP_RESPONSE, {
                success: true,
                message: "Group dissolved successfully",
                data: {
                    id: channelId,
                }
            });
        } catch (error) {
            console.error("Error dissolving group:", error);
            this.socket.emit(SOCKET_EVENTS.CHANNEL.DISSOLVE_GROUP_RESPONSE, {
                success: false,
                message: "Failed to dissolve group",
                error: error.message
            });
        }
    }


    async addMember(params) {
        const { channelId, userId } = params;
        try {
            // Gọi repository mới thêm
            const channel = await channelRepository.addMemberToChannel(
                channelId,
                userId
            );

            // 4. Emit cho tất cả thành viên nhóm
            channel.members.forEach((member) => {
                this.io
                    .to(member.userId) // assume room by userId
                    .emit(SOCKET_EVENTS.CHANNEL.ADD_MEMBER_RESPONSE, {
                        success: true,
                        data: channel,
                        message: "Thêm thành viên thành công",
                    });
            });
        } catch (error) {
            console.error("Error adding member:", error);
            this.socket.emit(SOCKET_EVENTS.CHANNEL.ADD_MEMBER_RESPONSE, {
                success: false,
                message: error.message,
            });
        }
    }

    async getMembersOfChannel({ channelId }) {
        try {
            const channel = await channelRepository.getChannel(channelId);
            return

        } catch (error) {
            console.log("💲💲💲 ~ ChannelSocket ~ getMembersOfChannel ~ error:", error)
        }
    }

    async assignRole({ channelId, userId, targetUserId, newRole }) {
        try {
            const channel = await channelRepository.getChannel(channelId);

            const admin = channel.members.find(m => m.userId.toString() === userId);
            const target = channel.members.find(m => m.userId.toString() === targetUserId);

            if (!admin || ![ROLE_TYPES.CAPTAIN, ROLE_TYPES.SUB_CAPTAIN].includes(admin.role)) {
                return this.socket.emit(SOCKET_EVENTS.CHANNEL.ERROR, {
                    message: "Bạn không có quyền thay đổi vai trò.",
                });
            }

            if (!target) {
                return this.socket.emit(SOCKET_EVENTS.CHANNEL.ERROR, {
                    message: "Thành viên không tồn tại trong nhóm.",
                });
            }

            if (newRole === ROLE_TYPES.CAPTAIN) {
                const currentCaptain = channel.members.find(
                    m => m.role === ROLE_TYPES.CAPTAIN && m.userId.toString() !== targetUserId
                );

                if (currentCaptain) {
                    if (currentCaptain.userId.toString() !== userId) {
                        return this.socket.emit(SOCKET_EVENTS.CHANNEL.ERROR, {
                            message: "Chỉ trưởng nhóm hiện tại mới có quyền chuyển giao.",
                        });
                    }
                    currentCaptain.role = ROLE_TYPES.MEMBER;
                }
            }

            if (admin.role === ROLE_TYPES.SUB_CAPTAIN && newRole === ROLE_TYPES.CAPTAIN) {
                return this.socket.emit(SOCKET_EVENTS.CHANNEL.ERROR, {
                    message: "Phó nhóm không được gán trưởng nhóm.",
                });
            }
            if (admin.userId.toString() === targetUserId && newRole === ROLE_TYPES.MEMBER) {
                const subCaptainExists = channel.members.some(m => m.role === ROLE_TYPES.SUB_CAPTAIN);
                const memberExists = channel.members.some(m => m.role === ROLE_TYPES.MEMBER);

                if (!subCaptainExists && !memberExists) {
                    return this.socket.emit(SOCKET_EVENTS.CHANNEL.ERROR, {
                        message: "Không thể rời chức captain vì không có phó nhóm hoặc member để thay thế.",
                    });
                }
            }
            target.role = newRole;
            await channelRepository.assignRoleChannelId(channel.id, channel.members);

            channel.members.forEach(member => {
                this.io.to(member.userId.toString()).emit(SOCKET_EVENTS.CHANNEL.ROLE_UPDATED, {
                    success: true,
                    data: channel,
                    message: "Thay đổi vai trò thành công",
                });
            });

        } catch (err) {
            console.error("Assign role error:", err);
            this.socket.emit(SOCKET_EVENTS.CHANNEL.ERROR, {
                message: "Đã có lỗi xảy ra.",
            });
        }
    }

}

export default ChannelSocket;