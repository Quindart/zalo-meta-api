import SOCKET_EVENTS from "../../../constants/eventEnum.js";
import channelRepository from "../../../domain/repository/Channel.repository.js";
import Message from "../../mongo/model/Message.js";
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
    }
    async sendMessage(data) {
        const channel = await channelRepository.getChannel(data.channelId);
        const message = {
            id: Date.now().toString(),
            content: data.content,
            senderId: data.senderId,
            channelId: channel.id,
            status: "send",
            timestamp: new Date(),
        };
        const newMessage = new Message(message);
        await newMessage.save();


        this.io.emit(SOCKET_EVENTS.MESSAGE.RECEIVED, message);
    }

    async readMessage(data) {
        console.log(`Message ${data.messageId} read by ${data.readerId}`);
        const messageUpdate = {
            messageId: data.messageId,
            status: "read",
        };
        this.io.to(data.senderId).emit(SOCKET_EVENTS.MESSAGE.READ, messageUpdate);
    }
}

export default MessageSocket
