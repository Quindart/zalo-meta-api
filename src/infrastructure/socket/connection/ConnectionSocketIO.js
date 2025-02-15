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
      socket.on("disconnect", () => {
        console.log(`🔥: A user disconnected`);
      });
    });
  }
}

export default new SocketService();
