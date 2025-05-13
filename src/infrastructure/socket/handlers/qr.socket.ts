import { Server, Socket } from "socket.io";
import SOCKET_EVENTS from "../../../constants/eventEnum";

class QRSocket {
    public io: Server;
    public socket: Socket;
    constructor(io: Server, socket: Socket) {
        this.io = io;
        this.socket = socket;
        this.registerEvents();
    }
    registerEvents() {
        this.socket.on(SOCKET_EVENTS.QR.ACCEPTED_LOGIN, this.acceptedLogin.bind(this));
        this.socket.on(SOCKET_EVENTS.QR.VERIFY, this.verify.bind(this));
    }

    async verify(detectInfo) {
        this.io.emit(SOCKET_EVENTS.QR.VERIFY, detectInfo)
    }
    async acceptedLogin(loginQR) {
        this.io.emit(SOCKET_EVENTS.QR.ACCEPTED_LOGIN, loginQR)
    }

}

export default QRSocket