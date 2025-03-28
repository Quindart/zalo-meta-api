import SOCKET_EVENTS from "../../../constants/eventEnum.js";
import chatController from "../../../application/handlers/chat.controller.js";
import Message from "../../mongo/model/Message.js";
import { UserRepository } from "../../../domain/repository/User.repository.js";

class MessageSocket {
    userRepo
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
        this.registerEvents();
        this.userRepo  = new UserRepository()
    }
    registerEvents() {
        this.socket.on(SOCKET_EVENTS.MESSAGE.SEND, this.sendMessage.bind(this));
        this.socket.on(SOCKET_EVENTS.MESSAGE.READ, this.readMessage.bind(this));
    }
    async sendMessage(data) {
        const chat = await chatController.findOrCreateChat([data.senderId, data.receiverId]);
        const chatId = chat?._id;

        const sender = await  this.userRepo.findUserSelect(data.senderId,['avatar','firstName','lastName','id'])
        const receiver = await  this.userRepo.findUserSelect(data.receiverId,['avatar','firstName','lastName','id'])


        const message = {
            id: Date.now().toString(),
            sender,
            receiver,
            content: data.content,
            chatId: chatId,
            status: "sent",
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
            readerId: data.readerId,
            status: "read",
        };
        this.io.to(data.senderId).emit(SOCKET_EVENTS.MESSAGE.READ, messageUpdate);
    }
}

export default MessageSocket
