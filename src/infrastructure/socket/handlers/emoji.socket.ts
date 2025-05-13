import SOCKET_EVENTS from "../../../constants/eventEnum";
import { Server, Socket } from "socket.io";
import { container } from "../../inversify/container";
import TYPES from "../../inversify/type";
import { IEmojiService } from "../../../application/interfaces/services/IEmojiService";
import { IChannelService } from "../../../application/interfaces/services/IChannelService";
class EmojiSocket {
    public io: Server;
    public socket: Socket;
    private emojiService : IEmojiService;
    private channelService: IChannelService;
    constructor(io: Server, socket: Socket) {
        this.io = io;
        this.socket = socket;
        this.registerEvents();
        this.emojiService = container.get<IEmojiService>(TYPES.EmojiService)
        this.channelService = container.get<IChannelService>(TYPES.ChannelService)
    }
    registerEvents() {
        this.socket.on(SOCKET_EVENTS.EMOJI.INTERACT_EMOJI, this.interactEmoji.bind(this));
        this.socket.on(SOCKET_EVENTS.EMOJI.REMOVE_MY_EMOJI, this.removeMyEmoji.bind(this));
        this.socket.on(SOCKET_EVENTS.EMOJI.LOAD_EMOJIS_OF_MESSAGE, this.loadEmojiOfMessage.bind(this));
    }

    async interactEmoji(params: { messageId: string, emoji: any, userId: string, channelId: string }) {
        const { messageId, emoji, userId, channelId } = params;
        const result = await this.emojiService.addEmoji(messageId, emoji, userId);

        const channel = await this.channelService.getChannel(channelId, userId);
        this.socket.emit(SOCKET_EVENTS.EMOJI.INTERACT_EMOJI_RESPONSE, result);
        channel.members.forEach((member: any) => {
            this.io.to(member.userId).emit(SOCKET_EVENTS.EMOJI.INTERACT_EMOJI_RESPONSE, result);
        });
    }
    async removeMyEmoji(params: { messageId: string, userId: string, channelId: string }) {
        const { messageId, userId, channelId } = params;
       
        const result = await this.emojiService.deleteMyEmoji(messageId, userId);
      
        this.socket.emit(SOCKET_EVENTS.EMOJI.REMOVE_MY_EMOJI_RESPONSE, result);
       
        const channel = await this.channelService.getChannel(channelId, userId);
       
        channel.members.forEach((member: any) => {
            if (member.userId.toString() !== userId) {
                this.io.to(member.userId).emit(SOCKET_EVENTS.EMOJI.INTERACT_EMOJI_RESPONSE, result);
            }
        });
    }
    async loadEmojiOfMessage(params: { messageId: string }) {
        const { messageId } = params;
        const result = await this.emojiService.getAllEmojiOfMessage(messageId);
        this.socket.emit(SOCKET_EVENTS.EMOJI.LOAD_EMOJIS_OF_MESSAGE_RESPONSE, result);
    }
}

export default EmojiSocket;