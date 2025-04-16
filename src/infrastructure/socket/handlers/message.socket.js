import SOCKET_EVENTS from "../../../constants/eventEnum.js";
import channelRepository from "../../../domain/repository/Channel.repository.js";
import messageRepository from "../../../domain/repository/Message.repository.js";
import Message from "../../mongo/model/Message.js";
import Channel from "../../mongo/model/Channel.js";
import { UserRepository } from "../../../domain/repository/User.repository.js";

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
        this.io.emit(SOCKET_EVENTS.MESSAGE.RECEIVED, messageResponse);
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
            console.log("check params load message: ", params);
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
}

export default MessageSocket
