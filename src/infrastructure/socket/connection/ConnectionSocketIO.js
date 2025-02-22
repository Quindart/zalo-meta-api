import { Server } from "socket.io";
class SocketService {
  start(server) {
    const io = new Server(server, {
      cors: {
        origin: "*",
      },
    });
    io.on("connection", (socket) => {
      console.log(`⚡: ${socket.id} user just connected!`);
      socket.on("send_message", (data) => {
        console.log("Tin nhắn nhận được:", data);
        io.emit("receive_message", data);
      });
      socket.on("disconnect", () => {
        console.log(`🔥: A user disconnected`);
      });
    });
  }
}

export default new SocketService();
