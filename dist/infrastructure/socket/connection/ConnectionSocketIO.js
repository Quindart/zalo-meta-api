"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const message_socket_1 = __importDefault(require("../handlers/message.socket"));
const user_socket_1 = __importDefault(require("../handlers/user.socket"));
const qr_socket_1 = __importDefault(require("../handlers/qr.socket"));
const channel_socket_1 = __importDefault(require("../handlers/channel.socket"));
const friend_socket_1 = __importDefault(require("../handlers/friend.socket"));
const emoji_socket_1 = __importDefault(require("../handlers/emoji.socket"));
class SocketService {
    constructor(server) {
        this.messageSocket = null;
        this.userSocket = null;
        this.qrSocket = null;
        this.emojiSocket = null;
        this.channelSocket = null;
        this.friendSocket = null;
        this.io = new socket_io_1.Server(server, {
            cors: {
                origin: "*",
            },
        });
    }
    getIO() {
        return this.io;
    }
    start() {
        console.log("🚀 Socket is running");
        this.io.on("connection", (socket) => {
            const userId = socket.handshake.query.userId;
            if (userId && typeof userId === "string") {
                socket.join(userId);
                console.log(`Socket ${socket.id} joined room: ${userId}`);
            }
            else {
                console.warn(`Socket ${socket.id} connected without userId`);
            }
            console.log(`${socket.id} user just connected!`);
            this.messageSocket = new message_socket_1.default(this.io, socket);
            this.userSocket = new user_socket_1.default(this.io, socket);
            this.qrSocket = new qr_socket_1.default(this.io, socket);
            this.emojiSocket = new emoji_socket_1.default(this.io, socket);
            this.channelSocket = new channel_socket_1.default(this.io, socket);
            this.friendSocket = new friend_socket_1.default(this.io, socket);
            socket.on("send_message", (data) => {
                console.log("Tin nhắn nhận được:", data);
                this.io.emit("receive_message", data);
            });
            socket.on("disconnect", () => {
                console.log(`🔥: A user disconnected`);
            });
        });
    }
}
exports.default = SocketService;
