import { Server } from "socket.io";
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
declare class SocketService implements SocketServiceOptions {
    io: Server;
    messageSocket: MessageSocket | null;
    userSocket: UserSocket | null;
    qrSocket: QRSocket | null;
    emojiSocket: EmojiSocket | null;
    channelSocket: ChannelSocket | null;
    friendSocket: FriendSocket | null;
    constructor(server: any);
    getIO(): Server;
    start(): void;
}
export default SocketService;
