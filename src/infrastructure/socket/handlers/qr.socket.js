import SOCKET_EVENTS from "../../../constants/eventEnum.js";

class QRSocket {
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
    }
    registerEvents() {
        this.socket.on(SOCKET_EVENTS.QR.ACCEPTED_LOGIN, this.acceptedLogin.bind(this));
        this.socket.on(SOCKET_EVENTS.QR.VERIFY, this.verify.bind(this));
    }

    verify(detectInfo) {
        console.log("💲💲💲 ~ QRSocket ~ verify ~ detectInfo:", detectInfo)
        this.io.emit(SOCKET_EVENTS.QR.VERIFY, detectInfo)
    }
    acceptedLogin(loginQR) {
        console.log("💲💲💲 ~ QRSocket ~ verify ~ detectInfo:", loginQR)
        this.io.emit(SOCKET_EVENTS.QR.ACCEPTED_LOGIN, loginQR)
    }

}

export default QRSocket