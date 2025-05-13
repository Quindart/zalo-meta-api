import { Server, Socket } from "socket.io";
declare class EmojiSocket {
    io: Server;
    socket: Socket;
    private emojiService;
    private channelService;
    constructor(io: Server, socket: Socket);
    registerEvents(): void;
    interactEmoji(params: {
        messageId: string;
        emoji: any;
        userId: string;
        channelId: string;
    }): Promise<void>;
    removeMyEmoji(params: {
        messageId: string;
        userId: string;
        channelId: string;
    }): Promise<void>;
    loadEmojiOfMessage(params: {
        messageId: string;
    }): Promise<void>;
}
export default EmojiSocket;
