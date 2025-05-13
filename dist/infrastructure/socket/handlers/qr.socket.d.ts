import { Server, Socket } from "socket.io";
declare class QRSocket {
    io: Server;
    socket: Socket;
    constructor(io: Server, socket: Socket);
    registerEvents(): void;
    verify(detectInfo: any): Promise<void>;
    acceptedLogin(loginQR: any): Promise<void>;
}
export default QRSocket;
