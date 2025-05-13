import { Server, Socket } from "socket.io";
import SOCKET_EVENTS from "../../../constants/eventEnum";

class UserSocket {
    public io: Server;
    public socket: Socket;
    constructor(io: Server, socket: Socket) {
        this.io = io;
        this.socket = socket;
        this.registerEvents();
    }
    registerEvents() {
        this.socket.on(SOCKET_EVENTS.USER.ONLINE, this.userJoin.bind(this));
        this.socket.on(SOCKET_EVENTS.USER.OFFLINE, this.userDisconnect.bind(this));
    }
    userJoin(user) {
        console.log(`User joined: ${user.name}`);
        this.io.emit(SOCKET_EVENTS.USER.JOINED, user);
    }
    userDisconnect() {
        console.log(`User disconnected: ${this.socket.id}`);
        this.io.emit(SOCKET_EVENTS.USER.OFFLINE, { socketId: this.socket.id });
    }
}
export default UserSocket
