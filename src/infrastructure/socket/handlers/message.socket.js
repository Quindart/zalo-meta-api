import SOCKET_EVENTS from "../../../constants/eventEnum.js";
import channelRepository from "../../../domain/repository/Channel.repository.js";
import messageRepository from "../../../domain/repository/Message.repository.js";
import Message from "../../mongo/model/Message.js";
import { UserRepository } from "../../../domain/repository/User.repository.js";
import File from "../../mongo/model/File.js";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

class MessageSocket {
    userRepo
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
        this.registerEvents();
        this.userRepo = new UserRepository()
    }
    registerEvents() {
        this.socket.on(SOCKET_EVENTS.MESSAGE.SEND, this.sendMessage.bind(this));
        this.socket.on(SOCKET_EVENTS.MESSAGE.READ, this.readMessage.bind(this));
        this.socket.on(SOCKET_EVENTS.MESSAGE.LOAD, this.loadMessage.bind(this));
        this.socket.on(SOCKET_EVENTS.MESSAGE.RECALL, this.recallMessage.bind(this));
        this.socket.on(SOCKET_EVENTS.MESSAGE.DELETE, this.deleteMessage.bind(this));
        this.socket.on(SOCKET_EVENTS.FILE.UPLOAD, this.uploadFile.bind(this));

        this.socket.on(SOCKET_EVENTS.MESSAGE.FORWARD, this.forwardMessage.bind(this))
        this.socket.on(SOCKET_EVENTS.MESSAGE.DELETE_HISTORY, this.deleteHistoryMessage.bind(this));

    }

    async sendMessage(data) {
        const channel = await channelRepository.getChannel(data.channelId);
        const sender = await this.userRepo.findOne(data.senderId);
        const message = {
            content: data.content,
            senderId: data.senderId,
            channelId: channel.id,
            status: "send",
            timestamp: new Date(),
        };
        const newMessage = new Message(message);
        await newMessage.save();

        // UPDATE LAST MESSAGE IN CHANNEL
        await channelRepository.updateLastMessage(channel.id, newMessage._id);

        const messageResponse = {
            id: newMessage._id,
            content: data.content,
            sender: {
                id: sender._id,
                name: sender.lastName + " " + sender.firstName,
                avatar: sender.avatar,
            },
            members: channel.members,
            channelId: channel.id,
            status: "send",
            timestamp: new Date(),
            isMe: true,
        };

        this.socket.emit(SOCKET_EVENTS.MESSAGE.RECEIVED, messageResponse);
        channel.members.forEach((member) => {
            if (member.userId.toString() !== data.senderId) {
                this.io.to(member.userId).emit(SOCKET_EVENTS.MESSAGE.RECEIVED, messageResponse);
            }
        });


    }

    async readMessage(data) {
        const messageUpdate = {
            messageId: data.messageId,
            status: "read",
        };
        this.io.to(data.senderId).emit(SOCKET_EVENTS.MESSAGE.READ, messageUpdate);
    }

    async loadMessage(params) {
        try {
            const { channelId, offset } = params;
            const messages = await messageRepository.getMessages(channelId, offset);
            this.socket.emit(SOCKET_EVENTS.MESSAGE.LOAD_RESPONSE, {
                success: true,
                data: messages,
                message: "Messages loaded successfully",
            });
        } catch (error) {
            console.error("Error loading messages:", error);
            this.socket.emit(SOCKET_EVENTS.MESSAGE.LOAD_RESPONSE, {
                success: false,
                data: [],
                message: "Failed to load messages",
            });
        }
    }

    async uploadFile(data) {
        const { channelId, senderId, fileName, fileData, timestamp } = data;
        try {
            const channel = await channelRepository.getChannel(channelId);
            if (!channel) {
                this.socket.emit(SOCKET_EVENTS.FILE.UPLOAD_RESPONSE, {
                    success: false,
                    message: "Channel not found",
                });
                return;
            }

            const sender = await this.userRepo.findOne(senderId);
            if (!sender) {
                this.socket.emit(SOCKET_EVENTS.FILE.UPLOAD_RESPONSE, {
                    success: false,
                    message: "Sender not found",
                });
                return;
            }

            // Tải file lên Cloudinary
            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: "auto", // Let Cloudinary auto-detect the resource type
                        folder: "zalo-meta-storage",
                        public_id: `file_${Date.now()}_${fileName.replace(/[^a-zA-Z0-9.]/g, '_')}`, // Sanitize filename
                        transformation: [{ quality: "auto:good", fetch_format: "auto" }],
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                streamifier.createReadStream(Buffer.from(fileData)).pipe(stream);
            });
            if (!uploadResult || uploadResult.error) {
                this.socket.emit(SOCKET_EVENTS.FILE.UPLOAD_RESPONSE, {
                    success: false,
                    message: "File upload failed",
                });
                return;
            }

            const fileExtension = fileName.split('.').pop() || '';
            const fileNameWithoutExtension = fileName.split('.').slice(0, -1).join('.') || fileName;
            const file = new File({
                filename: fileNameWithoutExtension,
                path: uploadResult.secure_url,
                size: uploadResult.bytes,
                thread: channelId,
                extension: fileExtension,
            });

            const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
            const videoExtensions = ['mp4', 'mov', 'avi', 'webm'];
            const audioExtensions = ['mp3', 'wav', 'ogg', 'aac', 'm4a', 'flac'];
            const fileExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'zip', 'rar'];
            let messageType = "";

            if (imageExtensions.includes(fileExtension)) {
                messageType = "image";
            } else if (videoExtensions.includes(fileExtension)) {
                messageType = "video";
            } else if (audioExtensions.includes(fileExtension)) {
                messageType = "audio";
            } else if (fileExtensions.includes(fileExtension)) {
                messageType = "file";
            } else {
                messageType = "file";
            }


            const newMessage = new Message({
                content: fileName,
                senderId: data.senderId,
                channelId: channel.id,
                status: "send",
                timestamp: new Date(),
                fileId: file._id,
                messageType: messageType,
            });

            await file.save();
            await newMessage.save();
            await channelRepository.updateLastMessage(channelId, newMessage._id);

            const messageResponse = {
                id: newMessage._id,
                content: fileName,
                sender: {
                    id: sender._id,
                    name: sender.lastName + " " + sender.firstName,
                    avatar: sender.avatar,
                },
                messageType: newMessage.messageType,
                file: {
                    id: file._id,
                    filename: file.filename,
                    size: file.size,
                    path: file.path,
                    extension: file.extension,
                },
                members: channel.members,
                channelId: channel.id,
                status: "send",
                timestamp: new Date(),
                isMe: true,
            };

            console.log("File uploaded successfully:", messageResponse);

            this.socket.emit(SOCKET_EVENTS.FILE.UPLOAD_RESPONSE, {
                success: true,
                message: "File uploaded successfully",
                data: {
                    message: messageResponse,
                },
            });

            channel.members.forEach((member) => {
                if (member.userId.toString() !== data.senderId) {
                    this.io.to(member.userId).emit(SOCKET_EVENTS.MESSAGE.RECEIVED, messageResponse);
                }
            });
        } catch (error) {
            console.error("Error uploading file:", error);
            this.socket.emit(SOCKET_EVENTS.FILE.UPLOAD_RESPONSE, {
                success: false,
                message: "File upload failed",
            });
        }
    }

    //TODO: Xoa tin nhan
    async recallMessage(data) {
        const { senderId, messageId } = data
        await messageRepository.recallMessage(senderId, messageId);
        this.socket.emit(SOCKET_EVENTS.MESSAGE.RECALL_RESPONSE, {
            success: true,
            data: {
                messageId,
            },
        });
    }
    //TODO: thu hoi tin nhan
    async deleteMessage(data) {
        const { senderId, messageId, channelId } = data
        await messageRepository.deleteMessage(senderId, messageId);
        const channel = await channelRepository.getChannel(channelId);
        channel.members.forEach((member) => {
            if (member.userId.toString() !== senderId) {
                this.io.to(member.userId).emit(SOCKET_EVENTS.MESSAGE.DELETE_RESPONSE, {
                    success: true,
                    data: {
                        messageId,
                    },
                });
            }
        });
        this.socket.emit(SOCKET_EVENTS.MESSAGE.DELETE_RESPONSE, {
            success: true,
            data: {
                messageId,
            },
        });
    }
    async forwardMessage(data) {
        try {
            const { messageId, channelId, senderId, content } = data;
    
            // Lấy message gốc
            const originalMessage = await Message.findById(messageId).populate("fileId");
            if (!originalMessage) throw new Error("Message not found");
    
            const channel = await channelRepository.getChannel(channelId);
            if (!channel) throw new Error("Channel not found");
    
            const sender = await this.userRepo.findOne(senderId);
    
            const newMessageData = {
                content: content || originalMessage.content,
                senderId: senderId,
                channelId: channelId,
                messageType: originalMessage.messageType,
                fileId: originalMessage.fileId || null,
                status: "send",
                timestamp: new Date(),
            };
    
            const newMessage = new Message(newMessageData);
            await newMessage.save();
            await channelRepository.updateLastMessage(channelId, newMessage._id);
    
            const messageResponse = {
                id: newMessage._id,
                content: newMessage.content,
                sender: {
                    id: sender._id,
                    name: `${sender.lastName} ${sender.firstName}`,
                    avatar: sender.avatar,
                },
                messageType: newMessage.messageType,
                file: newMessage.messageType === "file" && originalMessage.fileId
                    ? {
                        id: originalMessage.fileId._id,
                        filename: originalMessage.fileId.filename,
                        path: originalMessage.fileId.path,
                        size: originalMessage.fileId.size,
                        extension: originalMessage.fileId.extension,
                    }
                    : null,
                members: channel.members,
                channelId: channel.id,
                status: "send",
                timestamp: new Date(),
                isMe: true,
            };
    
            // Emit cho sender
            this.socket.emit(SOCKET_EVENTS.MESSAGE.FORWARD, messageResponse);
    
            // Emit cho các thành viên khác trong channel
            channel.members.forEach((member) => {
                if (member.userId.toString() !== senderId) {
                    this.io.to(member.userId).emit(SOCKET_EVENTS.MESSAGE.FORWARD, messageResponse);
                }
            });
    
        } catch (error) {
            console.error("Error forwarding message:", error);
            this.socket.emit(SOCKET_EVENTS.MESSAGE.FORWARD, {
                success: false,
                message: error.message || "Lỗi khi chuyển tiếp tin nhắn",
            });
        }
    }
    

    //TODO: Xóa lịch sử trò chuyện
    async deleteHistoryMessage(data) {
        const { senderId, channelId } = data
        await messageRepository.deleteHistoryMessage(senderId, channelId);
        this.socket.emit(SOCKET_EVENTS.MESSAGE.DELETE_HISTORY_RESPONSE, {
            success: true,
            data: {
                channelId,
            },
        });
    }

}

export default MessageSocket
