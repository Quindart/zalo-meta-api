import SOCKET_EVENTS from "../../../constants/eventEnum";
import Message from "../../mongo/model/Message";
import File from "../../mongo/model/File";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import FCM from "../../mongo/model/FCM";
import { expo } from "../../../config/expo-notify"
import { Expo } from "expo-server-sdk";
import mongoose, { Mongoose } from 'mongoose';
import { Server, Socket } from "socket.io";
import { IUserService } from "../../../application/interfaces/services/IUserService";
import { IMessageService } from "../../../application/interfaces/services/IMessageService";
import { IChannelService } from "../../../application/interfaces/services/IChannelService";
import { container } from "../../inversify/container";
import TYPES from "../../inversify/type";

class MessageSocket {
    public userRepo: any;
    public io: Server;
    public socket: Socket;

    public userService: IUserService;
    public messageService: IMessageService;
    public channelService: IChannelService;


    constructor(io: Server, socket: Socket) {
        this.io = io;
        this.socket = socket;
        this.registerEvents();
        this.userService = container.get<IUserService>(TYPES.UserService)
        this.channelService = container.get<IChannelService>(TYPES.ChannelService)
        this.messageService = container.get<IMessageService>(TYPES.MessageRepository)
    }
    registerEvents() {
        this.socket.on(SOCKET_EVENTS.MESSAGE.SEND, this.sendMessage.bind(this));
        this.socket.on(SOCKET_EVENTS.MESSAGE.READ, this.readMessage.bind(this));
        this.socket.on(SOCKET_EVENTS.MESSAGE.LOAD, this.loadMessage.bind(this));
        this.socket.on(SOCKET_EVENTS.MESSAGE.RECALL, this.recallMessage.bind(this));
        this.socket.on(SOCKET_EVENTS.MESSAGE.DELETE, this.deleteMessage.bind(this));
        this.socket.on(SOCKET_EVENTS.FILE.UPLOAD, this.uploadFile.bind(this));
        this.socket.on(SOCKET_EVENTS.FILE.UPLOAD_GROUP, this.uploadGroupImages.bind(this));

        this.socket.on(SOCKET_EVENTS.MESSAGE.FORWARD, this.forwardMessage.bind(this))
        this.socket.on(SOCKET_EVENTS.MESSAGE.DELETE_HISTORY, this.deleteHistoryMessage.bind(this));

    }

    async sendMessage(data: any) {
        const channel = await this.channelService.getChannel(data.channelId);
        const sender = await this.userService.findOne(data.senderId);
        const message = {
            content: data.content,
            senderId: data.senderId,
            fcmToken: data.fcmToken,
            channelId: channel.id,
            status: "send",
            timestamp: new Date(),
        };
        const newMessage = new Message(message);
        await newMessage.save();

        // UPDATE LAST MESSAGE IN CHANNEL
        await this.channelService.updateLastMessage(channel.id, `${newMessage._id}`);

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

        channel.members.forEach(async (member: any) => {
            if (member.userId.toString() !== data.senderId) {
                this.io.to(member.userId).emit(SOCKET_EVENTS.MESSAGE.RECEIVED, messageResponse);
                const fcm = await FCM.findOne({ user: member.userId });
                if (fcm && fcm.fcmToken) {
                    if (Expo.isExpoPushToken(fcm.fcmToken)) {
                        const messages = [{
                            to: fcm.fcmToken,
                            sound: 'default',
                            title: `${sender.lastName} ${sender.firstName}`,
                            body: message.content,
                            data: {
                                channelId: channel.id.toString(),
                                messageId: newMessage._id.toString()
                            },
                        }];

                        // Gửi thông báo qua Expo
                        const chunks = expo.chunkPushNotifications(messages);
                        for (let chunk of chunks) {
                            try {
                                await expo.sendPushNotificationsAsync(chunk);
                            } catch (error) {
                                console.error('Error sending Expo notification:', error);
                            }
                        }
                    } else {
                        console.log(`Invalid Expo token format for user ${member.userId}`);
                    }
                }
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

    async loadMessage(params: { channelId: string, currentUserId: string, offset: number }) {
        try {
            const { channelId, currentUserId, offset } = params;
            const messages = await this.messageService.getMessages(channelId, currentUserId, offset);
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
            const channel = await this.channelService.getChannel(channelId);
            if (!channel) {
                this.socket.emit(SOCKET_EVENTS.FILE.UPLOAD_RESPONSE, {
                    success: false,
                    message: "Channel not found",
                });
                return;
            }

            const sender = await this.userService.findOne(senderId);
            if (!sender) {
                this.socket.emit(SOCKET_EVENTS.FILE.UPLOAD_RESPONSE, {
                    success: false,
                    message: "Sender not found",
                });
                return;
            }

            // Tải file lên Cloudinary
            const uploadResult = await new Promise<{ secure_url: string; bytes: number; }>((resolve, reject) => {
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
            if (!uploadResult || (uploadResult as { error?: any }).error) {
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
                path: (uploadResult as { secure_url: string }).secure_url,
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
            await this.channelService.updateLastMessage(channelId, `${newMessage._id}`);

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
        await this.messageService.recallMessage(senderId, messageId);
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
        console.log("check data delete message: ", data)
        await this.messageService.deleteMessage(senderId, messageId);
        const channel = await this.channelService.getChannel(channelId);
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
            const { messageId, channelId, senderId } = data;
            const receiver = await this.userService.findOne(channelId);
            if (!receiver) {
                console.error("Receiver not found:", channelId);
                return;
            }
            const nameChannel = receiver.lastName + receiver.firstName;
            const typeChannel = "personal";
            const avatarChannel = receiver.avatar || null;

            // Kiểm tra kênh và tạo kênh mới nếu không tồn tại
            let channel;
            try {
                channel = await this.channelService.findOrCreateChannelPersonal(channelId, senderId, nameChannel, typeChannel, avatarChannel);
            } catch (error) {
                console.error("Error finding or creating channel:", error);
                return;
            }

            // Lấy message gốc
            const originalMessage = await Message.findById(new mongoose.Types.ObjectId(messageId)).populate<{ fileId: any }>("fileId");
            if (!originalMessage) throw new Error("Message not found");

            // Nếu không tìm thấy kênh, trả về lỗi
            if (!channel) throw new Error("Channel not found");

            const sender = await this.userService.findOne(senderId);

            const newMessageData = {
                content: originalMessage.content || "",
                senderId: senderId,
                channelId: channel.id,
                messageType: originalMessage.messageType,
                fileId: originalMessage.fileId || null,
                imagesGroup: originalMessage.imagesGroup || [],
                status: "send",
                timestamp: new Date(),
            };

            const newMessage = new Message(newMessageData);
            await newMessage.save();
            await this.channelService.updateLastMessage(channel.id, `${newMessage._id}`);

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
                        filename: originalMessage.fileId?.filename || "",
                        path: originalMessage.fileId.path ?? "",
                        size: originalMessage.fileId.size,
                        extension: originalMessage.fileId.extension,
                    }
                    : null,
                imagesGroup: newMessage.imagesGroup.map((file: any) => ({
                    id: file._id,
                    filename: file.filename,
                    size: file.size,
                    path: file.path,
                    extension: file.extension,
                })),
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
        await this.messageService.deleteHistoryMessage(senderId, channelId);
        this.socket.emit(SOCKET_EVENTS.MESSAGE.DELETE_HISTORY_RESPONSE, {
            success: true,
            data: {
                channelId,
            },
        });
    }

    async uploadGroupImages(data) {
        const { channelId, senderId, files, timestamp } = data;
        try {
            if (!files || !Array.isArray(files) || files.length === 0) {
                this.socket.emit(SOCKET_EVENTS.FILE.UPLOAD_GROUP_RESPONSE, {
                    success: false,
                    message: "No files provided",
                });
                return;
            }

            // Validate file sizes before uploading
            const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit per file
            const oversizedFiles = files.filter(file => file.fileData.length > MAX_FILE_SIZE);
            if (oversizedFiles.length > 0) {
                this.socket.emit(SOCKET_EVENTS.FILE.UPLOAD_GROUP_RESPONSE, {
                    success: false,
                    message: `${oversizedFiles.length} file(s) exceed the maximum size of 10MB`,
                });
                return;
            }

            const channel = await this.channelService.getChannel(channelId);
            if (!channel) {
                console.error("Channel not found:", channelId);
                this.socket.emit(SOCKET_EVENTS.FILE.UPLOAD_GROUP_RESPONSE, {
                    success: false,
                    message: "Channel not found",
                });
                return;
            }

            const sender = await this.userService.findOne(senderId);
            if (!sender) {
                console.error("Sender not found:", senderId);
                this.socket.emit(SOCKET_EVENTS.FILE.UPLOAD_GROUP_RESPONSE, {
                    success: false,
                    message: "Sender not found",
                });
                return;
            }

            // Upload files with progress tracking
            const uploadedFiles = [];
            let failedUploads = 0;

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                try {
                    // Set longer timeout for larger files
                    const uploadResult: any = await new Promise((resolve, reject) => {
                        const uploadOptions: any = {
                            resource_type: "auto",
                            folder: "zalo-meta-storage",
                            public_id: `file_${Date.now()}_${file.fileName.replace(/[^a-zA-Z0-9.]/g, '_')}`,
                            transformation: [{ quality: "auto:good", fetch_format: "auto" }],
                            timeout: 60000, // 60 seconds timeout
                        };

                        const stream = cloudinary.uploader.upload_stream(
                            uploadOptions,
                            (error, result) => {
                                if (error) {
                                    console.error("Cloudinary upload error:", error);
                                    reject(error);
                                } else {
                                    resolve(result);
                                }
                            }
                        );

                        // Create a buffer from the file data and pipe it to the stream
                        const buffer = Buffer.from(file.fileData);
                        streamifier.createReadStream(buffer).pipe(stream);
                    });

                    if (!uploadResult || uploadResult.error) {
                        console.error("File upload failed:", uploadResult.error);
                        failedUploads++;
                        continue;
                    }

                    const fileExtension = file.fileName.split('.').pop() || '';
                    const fileNameWithoutExtension = file.fileName.split('.').slice(0, -1).join('.') || file.fileName;

                    const fileNew = new File({
                        filename: fileNameWithoutExtension,
                        path: uploadResult.secure_url || '',
                        size: uploadResult.bytes || 0,
                        thread: channelId,
                        extension: fileExtension,

                    });

                    await fileNew.save();
                    uploadedFiles.push(fileNew);
                } catch (error) {
                    console.error(`Error uploading file ${file.fileName}:`, error);
                    failedUploads++;
                }
            }

            // Check if all uploads failed
            if (uploadedFiles.length === 0) {
                this.socket.emit(SOCKET_EVENTS.FILE.UPLOAD_GROUP_RESPONSE, {
                    success: false,
                    message: "All file uploads failed",
                });
                return;
            }

            // Create message with successfully uploaded files
            const fileIds = uploadedFiles.map(file => file._id);
            const newMessage = new Message({
                content: uploadedFiles.length > 1 ? `${uploadedFiles.length} hình ảnh` : "Hình ảnh",
                senderId: senderId,
                channelId: channel.id,
                status: "send",
                timestamp: new Date(),
                imagesGroup: fileIds,
                messageType: "imageGroup",
            });

            await newMessage.save();
            await this.channelService.updateLastMessage(channelId, `${newMessage._id}`);

            // Prepare response with file information
            const messageResponse = {
                id: newMessage._id,
                content: "Hình ảnh",
                sender: {
                    id: sender._id,
                    name: sender.lastName + " " + sender.firstName,
                    avatar: sender.avatar,
                },
                messageType: newMessage.messageType,
                imagesGroup: uploadedFiles.map((file: any) => ({
                    id: file._id,
                    filename: file.filename || "",
                    size: file.size || 0,
                    path: file.path || "",
                    extension: file.extension || "",
                })),
                members: channel.members,
                channelId: channel.id,
                status: "send",
                timestamp: new Date(),
                isMe: true,
            };

            console.log("Files uploaded successfully:", uploadedFiles.length);

            // this.socket.emit(SOCKET_EVENTS.FILE.UPLOAD_GROUP_RESPONSE, {
            //     success: true,
            //     message: "File uploaded successfully",
            //     data: {
            //         message: messageResponse,
            //     },
            // });

            // Notify other channel members
            channel.members.forEach((member) => {
                this.io.to(member.userId).emit(SOCKET_EVENTS.MESSAGE.RECEIVED, messageResponse);
            });

        } catch (error) {
            console.error("Error in uploadGroupImages:", error);
            this.socket.emit(SOCKET_EVENTS.FILE.UPLOAD_GROUP_RESPONSE, {
                success: false,
                message: `File upload failed: ${error.message || "Unknown error"}`,
            });
        }
    }

}

export default MessageSocket
