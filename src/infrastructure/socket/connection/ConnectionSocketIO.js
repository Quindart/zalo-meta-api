import { Server } from "socket.io";
import MessageSocket from "../handlers/message.socket.js";
import UserSocket from "../handlers/user.socket.js";
import QRSocket from "../handlers/qr.socket.js";
import ChannelSocket from "../handlers/channel.socket.js";
class SocketService {
  io;
  messageSocket;
  userSocket;
  getIO() {
    return this.io
  }
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: "*",
      },
    });
  }
  start() {
    console.log("🚀 Socket is running");
    this.io.on("connection", (socket) => {
      console.log(`${socket.id} user just connected!`);

      this.messageSocket = new MessageSocket(this.io, socket)
      this.userSocket = new UserSocket(this.io, socket)
      this.qrSocket = new QRSocket(this.io, socket)

      this.channelSocket = new ChannelSocket(this.io, socket)

      
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

export default SocketService;
