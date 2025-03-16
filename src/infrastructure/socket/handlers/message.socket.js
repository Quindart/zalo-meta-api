import SOCKET_EVENTS from "../../../constants/eventEnum.js";

class MessageSocket {
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
        this.registerEvents();
    }
    registerEvents() {
        this.socket.on(SOCKET_EVENTS.MESSAGE.SEND, this.sendMessage.bind(this));
        this.socket.on(SOCKET_EVENTS.MESSAGE.READ, this.readMessage.bind(this));
    }
    async sendMessage(data) {
        console.log(`New message from ${data.senderId} to ${data.receiverId}: ${data.content}`);
        const message = {
            id: Date.now().toString(),
            senderId: data.senderId,
            receiverId: data.receiverId,
            content: data.content,
            status: "sent",
            timestamp: new Date(),
        };
        console.log("💲💲💲 ~ MessageSocket ~ sendMessage ~ message:", message)
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
