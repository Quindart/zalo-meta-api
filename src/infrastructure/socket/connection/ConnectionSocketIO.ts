import { Server, Socket } from "socket.io";
import MessageSocket from "../handlers/message.socket";
import UserSocket from "../handlers/user.socket";
import QRSocket from "../handlers/qr.socket";
import ChannelSocket from "../handlers/channel.socket";
import FriendSocket from "../handlers/friend.socket";
import EmojiSocket from "../handlers/emoji.socket";

interface SocketServiceOptions {
  io: Server;
  messageSocket: MessageSocket | null;
  userSocket: UserSocket | null;
  qrSocket: QRSocket | null;
  emojiSocket: EmojiSocket | null;
  channelSocket: ChannelSocket | null;
  friendSocket: FriendSocket | null;
}

class SocketService implements SocketServiceOptions {
  io: Server;
  messageSocket: MessageSocket | null = null;
  userSocket: UserSocket | null = null;
  qrSocket: QRSocket | null = null;
  emojiSocket: EmojiSocket | null = null;
  channelSocket: ChannelSocket | null = null;
  friendSocket: FriendSocket | null = null;

  constructor(server: any) {
    this.io = new Server(server, {
      cors: {
        origin: "*",
      },
    });
  }

  getIO(): Server {
    return this.io;
  }
  start(): void {
    console.log("🚀 Socket is running");

    this.io.on("connection", (socket: Socket) => {
      const userId = socket.handshake.query.userId;
      if (userId && typeof userId === "string") {
        socket.join(userId);
        console.log(`Socket ${socket.id} joined room: ${userId}`);
      } else {
        console.warn(`Socket ${socket.id} connected without userId`);
      }

      console.log(`${socket.id} user just connected!`);

      this.messageSocket = new MessageSocket(this.io, socket);
      this.userSocket = new UserSocket(this.io, socket);
      this.qrSocket = new QRSocket(this.io, socket);
      this.emojiSocket = new EmojiSocket(this.io, socket);
      this.channelSocket = new ChannelSocket(this.io, socket);
      this.friendSocket = new FriendSocket(this.io, socket);

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
