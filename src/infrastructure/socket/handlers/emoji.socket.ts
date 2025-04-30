import SOCKET_EVENTS from "../../../constants/eventEnum.ts";
import emojiRepository from "../../../domain/repository/Emoij.Repository.ts";
import channelRepository from "../../../domain/repository/Channel.repository.ts";
import { Server, Socket } from "socket.io";
class EmojiSocket {
    public io: Server;
    public socket: Socket;
    constructor(io: Server, socket: Socket) {
        this.io = io;
        this.socket = socket;
        this.registerEvents();
    }
    registerEvents() {
        this.socket.on(SOCKET_EVENTS.EMOJI.INTERACT_EMOJI, this.interactEmoji.bind(this));
        this.socket.on(SOCKET_EVENTS.EMOJI.REMOVE_MY_EMOJI, this.removeMyEmoji.bind(this));
        this.socket.on(SOCKET_EVENTS.EMOJI.LOAD_EMOJIS_OF_MESSAGE, this.loadEmojiOfMessage.bind(this));
    }

    async interactEmoji(params: any) {
        const { messageId, emoji, userId, channelId } = params;
        console.log("params", params);
        const result = await emojiRepository.addEmoji(messageId, emoji, userId);
        const channel = await channelRepository.getChannel(channelId, userId);
        this.socket.emit(SOCKET_EVENTS.EMOJI.INTERACT_EMOJI_RESPONSE, result);
        channel.members.forEach((member) => {
            this.io.to(member.userId).emit(SOCKET_EVENTS.EMOJI.INTERACT_EMOJI_RESPONSE, result);
        });
    }
    async removeMyEmoji(params) {
        const { messageId, userId, channelId } = params;
        const result = await emojiRepository.deleteMyEmoji(messageId, userId);
        this.socket.emit(SOCKET_EVENTS.EMOJI.REMOVE_MY_EMOJI_RESPONSE, result);
        const channel = await channelRepository.getChannel(channelId, userId);
        channel.members.forEach((member: any) => {
            if (member.userId.toString() !== userId) {
                this.io.to(member.userId).emit(SOCKET_EVENTS.EMOJI.INTERACT_EMOJI_RESPONSE, result);
            }
        });
    }
    async loadEmojiOfMessage(params) {
        const { messageId } = params;
        const result = await emojiRepository.getAllEmojiOfMessage(messageId);
        this.socket.emit(SOCKET_EVENTS.EMOJI.LOAD_EMOJIS_OF_MESSAGE_RESPONSE, result);
    }
}

export default EmojiSocket;