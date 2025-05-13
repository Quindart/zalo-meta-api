"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eventEnum_1 = __importDefault(require("../../../constants/eventEnum"));
const container_1 = require("../../inversify/container");
const type_1 = __importDefault(require("../../inversify/type"));
class EmojiSocket {
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
        this.registerEvents();
        this.emojiService = container_1.container.get(type_1.default.EmojiService);
        this.channelService = container_1.container.get(type_1.default.ChannelService);
    }
    registerEvents() {
        this.socket.on(eventEnum_1.default.EMOJI.INTERACT_EMOJI, this.interactEmoji.bind(this));
        this.socket.on(eventEnum_1.default.EMOJI.REMOVE_MY_EMOJI, this.removeMyEmoji.bind(this));
        this.socket.on(eventEnum_1.default.EMOJI.LOAD_EMOJIS_OF_MESSAGE, this.loadEmojiOfMessage.bind(this));
    }
    interactEmoji(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { messageId, emoji, userId, channelId } = params;
            const result = yield this.emojiService.addEmoji(messageId, emoji, userId);
            const channel = yield this.channelService.getChannel(channelId, userId);
            this.socket.emit(eventEnum_1.default.EMOJI.INTERACT_EMOJI_RESPONSE, result);
            channel.members.forEach((member) => {
                this.io.to(member.userId).emit(eventEnum_1.default.EMOJI.INTERACT_EMOJI_RESPONSE, result);
            });
        });
    }
    removeMyEmoji(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { messageId, userId, channelId } = params;
            const result = yield this.emojiService.deleteMyEmoji(messageId, userId);
            this.socket.emit(eventEnum_1.default.EMOJI.REMOVE_MY_EMOJI_RESPONSE, result);
            const channel = yield this.channelService.getChannel(channelId, userId);
            channel.members.forEach((member) => {
                if (member.userId.toString() !== userId) {
                    this.io.to(member.userId).emit(eventEnum_1.default.EMOJI.INTERACT_EMOJI_RESPONSE, result);
                }
            });
        });
    }
    loadEmojiOfMessage(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { messageId } = params;
            const result = yield this.emojiService.getAllEmojiOfMessage(messageId);
            this.socket.emit(eventEnum_1.default.EMOJI.LOAD_EMOJIS_OF_MESSAGE_RESPONSE, result);
        });
    }
}
exports.default = EmojiSocket;
