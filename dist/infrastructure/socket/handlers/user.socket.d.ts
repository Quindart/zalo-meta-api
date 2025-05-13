import { Server, Socket } from "socket.io";
declare class UserSocket {
    io: Server;
    socket: Socket;
    constructor(io: Server, socket: Socket);
    registerEvents(): void;
    userJoin(user: any): void;
    userDisconnect(): void;
}
export default UserSocket;
