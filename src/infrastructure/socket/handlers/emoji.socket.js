import SOCKET_EVENTS from "../../../constants/eventEnum.js";
import emojiRepository from "../../../domain/repository/Emoij.Repository.js";

class EmojiSocket {
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
        this.registerEvents();
    }
    registerEvents() {
        this.socket.on(SOCKET_EVENTS.EMOJI.INTERACT_EMOJI, this.interactEmoji.bind(this));
        this.socket.on(SOCKET_EVENTS.EMOJI.REMOVE_MY_EMOJI, this.removeMyEmoji.bind(this));
        this.socket.on(SOCKET_EVENTS.EMOJI.LOAD_EMOJIS_OF_MESSAGE, this.loadEmojiOfMessage.bind(this));
    }

    async interactEmoji(params) {
        const { messageId, emoji, userId } = params;
        const result = await emojiRepository.addEmoji(messageId, emoji, userId);
        this.socket.emit(SOCKET_EVENTS.EMOJI.INTERACT_EMOJI, result);
    }
    async removeMyEmoji(params) {
        const { messageId, userId } = params;
        const result = await emojiRepository.deleteMyEmoji(messageId, userId);
        this.socket.emit(SOCKET_EVENTS.EMOJI.REMOVE_MY_EMOJI, result);
    }
    async loadEmojiOfMessage(params) {
        const { messageId } = params;
        const result = await emojiRepository.getAllEmojiOfMessage(messageId);
        this.socket.emit(SOCKET_EVENTS.EMOJI.LOAD_EMOJIS_OF_MESSAGE, result);
    }
}

export default EmojiSocket;