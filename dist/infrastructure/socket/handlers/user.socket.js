"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eventEnum_1 = __importDefault(require("../../../constants/eventEnum"));
class UserSocket {
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
        this.registerEvents();
    }
    registerEvents() {
        this.socket.on(eventEnum_1.default.USER.ONLINE, this.userJoin.bind(this));
        this.socket.on(eventEnum_1.default.USER.OFFLINE, this.userDisconnect.bind(this));
    }
    userJoin(user) {
        console.log(`User joined: ${user.name}`);
        this.io.emit(eventEnum_1.default.USER.JOINED, user);
    }
    userDisconnect() {
        console.log(`User disconnected: ${this.socket.id}`);
        this.io.emit(eventEnum_1.default.USER.OFFLINE, { socketId: this.socket.id });
    }
}
exports.default = UserSocket;
