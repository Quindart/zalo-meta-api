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
const Message_1 = __importDefault(require("../../mongo/model/Message"));
const File_1 = __importDefault(require("../../mongo/model/File"));
const cloudinary_1 = require("cloudinary");
const streamifier_1 = __importDefault(require("streamifier"));
const FCM_1 = __importDefault(require("../../mongo/model/FCM"));
const expo_notify_1 = require("../../../config/expo-notify");
const expo_server_sdk_1 = require("expo-server-sdk");
const mongoose_1 = __importDefault(require("mongoose"));
const container_1 = require("../../inversify/container");
const type_1 = __importDefault(require("../../inversify/type"));
class MessageSocket {
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
        this.registerEvents();
        this.userService = container_1.container.get(type_1.default.UserService);
        this.channelService = container_1.container.get(type_1.default.ChannelService);
        this.messageService = container_1.container.get(type_1.default.MessageRepository);
    }
    registerEvents() {
        this.socket.on(eventEnum_1.default.MESSAGE.SEND, this.sendMessage.bind(this));
        this.socket.on(eventEnum_1.default.MESSAGE.READ, this.readMessage.bind(this));
        this.socket.on(eventEnum_1.default.MESSAGE.LOAD, this.loadMessage.bind(this));
        this.socket.on(eventEnum_1.default.MESSAGE.RECALL, this.recallMessage.bind(this));
        this.socket.on(eventEnum_1.default.MESSAGE.DELETE, this.deleteMessage.bind(this));
        this.socket.on(eventEnum_1.default.FILE.UPLOAD, this.uploadFile.bind(this));
        this.socket.on(eventEnum_1.default.FILE.UPLOAD_GROUP, this.uploadGroupImages.bind(this));
        this.socket.on(eventEnum_1.default.MESSAGE.FORWARD, this.forwardMessage.bind(this));
        this.socket.on(eventEnum_1.default.MESSAGE.DELETE_HISTORY, this.deleteHistoryMessage.bind(this));
    }
    sendMessage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = yield this.channelService.getChannel(data.channelId);
            const sender = yield this.userService.findOne(data.senderId);
            const message = {
                content: data.content,
                senderId: data.senderId,
                fcmToken: data.fcmToken,
                channelId: channel.id,
                status: "send",
                timestamp: new Date(),
            };
            const newMessage = new Message_1.default(message);
            yield newMessage.save();
            // UPDATE LAST MESSAGE IN CHANNEL
            yield this.channelService.updateLastMessage(channel.id, `${newMessage._id}`);
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
            this.socket.emit(eventEnum_1.default.MESSAGE.RECEIVED, messageResponse);
            channel.members.forEach((member) => __awaiter(this, void 0, void 0, function* () {
                if (member.userId.toString() !== data.senderId) {
                    this.io.to(member.userId).emit(eventEnum_1.default.MESSAGE.RECEIVED, messageResponse);
                    const fcm = yield FCM_1.default.findOne({ user: member.userId });
                    if (fcm && fcm.fcmToken) {
                        if (expo_server_sdk_1.Expo.isExpoPushToken(fcm.fcmToken)) {
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
                            const chunks = expo_notify_1.expo.chunkPushNotifications(messages);
                            for (let chunk of chunks) {
                                try {
                                    yield expo_notify_1.expo.sendPushNotificationsAsync(chunk);
                                }
                                catch (error) {
                                    console.error('Error sending Expo notification:', error);
                                }
                            }
                        }
                        else {
                            console.log(`Invalid Expo token format for user ${member.userId}`);
                        }
                    }
                }
            }));
        });
    }
    readMessage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const messageUpdate = {
                messageId: data.messageId,
                status: "read",
            };
            this.io.to(data.senderId).emit(eventEnum_1.default.MESSAGE.READ, messageUpdate);
        });
    }
    loadMessage(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { channelId, currentUserId, offset } = params;
                const messages = yield this.messageService.getMessages(channelId, currentUserId, offset);
                this.socket.emit(eventEnum_1.default.MESSAGE.LOAD_RESPONSE, {
                    success: true,
                    data: messages,
                    message: "Messages loaded successfully",
                });
            }
            catch (error) {
                console.error("Error loading messages:", error);
                this.socket.emit(eventEnum_1.default.MESSAGE.LOAD_RESPONSE, {
                    success: false,
                    data: [],
                    message: "Failed to load messages",
                });
            }
        });
    }
    uploadFile(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { channelId, senderId, fileName, fileData, timestamp } = data;
            try {
                const channel = yield this.channelService.getChannel(channelId);
                if (!channel) {
                    this.socket.emit(eventEnum_1.default.FILE.UPLOAD_RESPONSE, {
                        success: false,
                        message: "Channel not found",
                    });
                    return;
                }
                const sender = yield this.userService.findOne(senderId);
                if (!sender) {
                    this.socket.emit(eventEnum_1.default.FILE.UPLOAD_RESPONSE, {
                        success: false,
                        message: "Sender not found",
                    });
                    return;
                }
                // Tải file lên Cloudinary
                const uploadResult = yield new Promise((resolve, reject) => {
                    const stream = cloudinary_1.v2.uploader.upload_stream({
                        resource_type: "auto", // Let Cloudinary auto-detect the resource type
                        folder: "zalo-meta-storage",
                        public_id: `file_${Date.now()}_${fileName.replace(/[^a-zA-Z0-9.]/g, '_')}`, // Sanitize filename
                        transformation: [{ quality: "auto:good", fetch_format: "auto" }],
                    }, (error, result) => {
                        if (error)
                            reject(error);
                        else
                            resolve(result);
                    });
                    streamifier_1.default.createReadStream(Buffer.from(fileData)).pipe(stream);
                });
                if (!uploadResult || uploadResult.error) {
                    this.socket.emit(eventEnum_1.default.FILE.UPLOAD_RESPONSE, {
                        success: false,
                        message: "File upload failed",
                    });
                    return;
                }
                const fileExtension = fileName.split('.').pop() || '';
                const fileNameWithoutExtension = fileName.split('.').slice(0, -1).join('.') || fileName;
                const file = new File_1.default({
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
                }
                else if (videoExtensions.includes(fileExtension)) {
                    messageType = "video";
                }
                else if (audioExtensions.includes(fileExtension)) {
                    messageType = "audio";
                }
                else if (fileExtensions.includes(fileExtension)) {
                    messageType = "file";
                }
                else {
                    messageType = "file";
                }
                const newMessage = new Message_1.default({
                    content: fileName,
                    senderId: data.senderId,
                    channelId: channel.id,
                    status: "send",
                    timestamp: new Date(),
                    fileId: file._id,
                    messageType: messageType,
                });
                yield file.save();
                yield newMessage.save();
                yield this.channelService.updateLastMessage(channelId, `${newMessage._id}`);
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
                this.socket.emit(eventEnum_1.default.FILE.UPLOAD_RESPONSE, {
                    success: true,
                    message: "File uploaded successfully",
                    data: {
                        message: messageResponse,
                    },
                });
                channel.members.forEach((member) => {
                    if (member.userId.toString() !== data.senderId) {
                        this.io.to(member.userId).emit(eventEnum_1.default.MESSAGE.RECEIVED, messageResponse);
                    }
                });
            }
            catch (error) {
                console.error("Error uploading file:", error);
                this.socket.emit(eventEnum_1.default.FILE.UPLOAD_RESPONSE, {
                    success: false,
                    message: "File upload failed",
                });
            }
        });
    }
    //TODO: Xoa tin nhan
    recallMessage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { senderId, messageId } = data;
            yield this.messageService.recallMessage(senderId, messageId);
            this.socket.emit(eventEnum_1.default.MESSAGE.RECALL_RESPONSE, {
                success: true,
                data: {
                    messageId,
                },
            });
        });
    }
    //TODO: thu hoi tin nhan
    deleteMessage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { senderId, messageId, channelId } = data;
            console.log("check data delete message: ", data);
            yield this.messageService.deleteMessage(senderId, messageId);
            const channel = yield this.channelService.getChannel(channelId);
            channel.members.forEach((member) => {
                if (member.userId.toString() !== senderId) {
                    this.io.to(member.userId).emit(eventEnum_1.default.MESSAGE.DELETE_RESPONSE, {
                        success: true,
                        data: {
                            messageId,
                        },
                    });
                }
            });
            this.socket.emit(eventEnum_1.default.MESSAGE.DELETE_RESPONSE, {
                success: true,
                data: {
                    messageId,
                },
            });
        });
    }
    forwardMessage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const { messageId, channelId, senderId } = data;
                const receiver = yield this.userService.findOne(channelId);
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
                    channel = yield this.channelService.findOrCreateChannelPersonal(channelId, senderId, nameChannel, typeChannel, avatarChannel);
                }
                catch (error) {
                    console.error("Error finding or creating channel:", error);
                    return;
                }
                // Lấy message gốc
                const originalMessage = yield Message_1.default.findById(new mongoose_1.default.Types.ObjectId(messageId)).populate("fileId");
                if (!originalMessage)
                    throw new Error("Message not found");
                // Nếu không tìm thấy kênh, trả về lỗi
                if (!channel)
                    throw new Error("Channel not found");
                const sender = yield this.userService.findOne(senderId);
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
                const newMessage = new Message_1.default(newMessageData);
                yield newMessage.save();
                yield this.channelService.updateLastMessage(channel.id, `${newMessage._id}`);
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
                            filename: ((_a = originalMessage.fileId) === null || _a === void 0 ? void 0 : _a.filename) || "",
                            path: (_b = originalMessage.fileId.path) !== null && _b !== void 0 ? _b : "",
                            size: originalMessage.fileId.size,
                            extension: originalMessage.fileId.extension,
                        }
                        : null,
                    imagesGroup: newMessage.imagesGroup.map((file) => ({
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
                this.socket.emit(eventEnum_1.default.MESSAGE.FORWARD, messageResponse);
                // Emit cho các thành viên khác trong channel
                channel.members.forEach((member) => {
                    if (member.userId.toString() !== senderId) {
                        this.io.to(member.userId).emit(eventEnum_1.default.MESSAGE.FORWARD, messageResponse);
                    }
                });
            }
            catch (error) {
                console.error("Error forwarding message:", error);
                this.socket.emit(eventEnum_1.default.MESSAGE.FORWARD, {
                    success: false,
                    message: error.message || "Lỗi khi chuyển tiếp tin nhắn",
                });
            }
        });
    }
    //TODO: Xóa lịch sử trò chuyện
    deleteHistoryMessage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { senderId, channelId } = data;
            yield this.messageService.deleteHistoryMessage(senderId, channelId);
            this.socket.emit(eventEnum_1.default.MESSAGE.DELETE_HISTORY_RESPONSE, {
                success: true,
                data: {
                    channelId,
                },
            });
        });
    }
    uploadGroupImages(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { channelId, senderId, files, timestamp } = data;
            try {
                if (!files || !Array.isArray(files) || files.length === 0) {
                    this.socket.emit(eventEnum_1.default.FILE.UPLOAD_GROUP_RESPONSE, {
                        success: false,
                        message: "No files provided",
                    });
                    return;
                }
                // Validate file sizes before uploading
                const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit per file
                const oversizedFiles = files.filter(file => file.fileData.length > MAX_FILE_SIZE);
                if (oversizedFiles.length > 0) {
                    this.socket.emit(eventEnum_1.default.FILE.UPLOAD_GROUP_RESPONSE, {
                        success: false,
                        message: `${oversizedFiles.length} file(s) exceed the maximum size of 10MB`,
                    });
                    return;
                }
                const channel = yield this.channelService.getChannel(channelId);
                if (!channel) {
                    console.error("Channel not found:", channelId);
                    this.socket.emit(eventEnum_1.default.FILE.UPLOAD_GROUP_RESPONSE, {
                        success: false,
                        message: "Channel not found",
                    });
                    return;
                }
                const sender = yield this.userService.findOne(senderId);
                if (!sender) {
                    console.error("Sender not found:", senderId);
                    this.socket.emit(eventEnum_1.default.FILE.UPLOAD_GROUP_RESPONSE, {
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
                        const uploadResult = yield new Promise((resolve, reject) => {
                            const uploadOptions = {
                                resource_type: "auto",
                                folder: "zalo-meta-storage",
                                public_id: `file_${Date.now()}_${file.fileName.replace(/[^a-zA-Z0-9.]/g, '_')}`,
                                transformation: [{ quality: "auto:good", fetch_format: "auto" }],
                                timeout: 60000, // 60 seconds timeout
                            };
                            const stream = cloudinary_1.v2.uploader.upload_stream(uploadOptions, (error, result) => {
                                if (error) {
                                    console.error("Cloudinary upload error:", error);
                                    reject(error);
                                }
                                else {
                                    resolve(result);
                                }
                            });
                            // Create a buffer from the file data and pipe it to the stream
                            const buffer = Buffer.from(file.fileData);
                            streamifier_1.default.createReadStream(buffer).pipe(stream);
                        });
                        if (!uploadResult || uploadResult.error) {
                            console.error("File upload failed:", uploadResult.error);
                            failedUploads++;
                            continue;
                        }
                        const fileExtension = file.fileName.split('.').pop() || '';
                        const fileNameWithoutExtension = file.fileName.split('.').slice(0, -1).join('.') || file.fileName;
                        const fileNew = new File_1.default({
                            filename: fileNameWithoutExtension,
                            path: uploadResult.secure_url || '',
                            size: uploadResult.bytes || 0,
                            thread: channelId,
                            extension: fileExtension,
                        });
                        yield fileNew.save();
                        uploadedFiles.push(fileNew);
                    }
                    catch (error) {
                        console.error(`Error uploading file ${file.fileName}:`, error);
                        failedUploads++;
                    }
                }
                // Check if all uploads failed
                if (uploadedFiles.length === 0) {
                    this.socket.emit(eventEnum_1.default.FILE.UPLOAD_GROUP_RESPONSE, {
                        success: false,
                        message: "All file uploads failed",
                    });
                    return;
                }
                // Create message with successfully uploaded files
                const fileIds = uploadedFiles.map(file => file._id);
                const newMessage = new Message_1.default({
                    content: uploadedFiles.length > 1 ? `${uploadedFiles.length} hình ảnh` : "Hình ảnh",
                    senderId: senderId,
                    channelId: channel.id,
                    status: "send",
                    timestamp: new Date(),
                    imagesGroup: fileIds,
                    messageType: "imageGroup",
                });
                yield newMessage.save();
                yield this.channelService.updateLastMessage(channelId, `${newMessage._id}`);
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
                    imagesGroup: uploadedFiles.map((file) => ({
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
                    this.io.to(member.userId).emit(eventEnum_1.default.MESSAGE.RECEIVED, messageResponse);
                });
            }
            catch (error) {
                console.error("Error in uploadGroupImages:", error);
                this.socket.emit(eventEnum_1.default.FILE.UPLOAD_GROUP_RESPONSE, {
                    success: false,
                    message: `File upload failed: ${error.message || "Unknown error"}`,
                });
            }
        });
    }
}
exports.default = MessageSocket;
