"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.MongooseEmojiRepository = void 0;
const inversify_1 = require("inversify");
const Emoji_1 = __importDefault(require("../model/Emoji"));
const Message_1 = __importDefault(require("../model/Message"));
let MongooseEmojiRepository = class MongooseEmojiRepository {
    addEmoji(messageId, emoji, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!messageId || !emoji || !userId) {
                    return {
                        success: false,
                        message: "messageId, emoji, and userId are required.",
                    };
                }
                let emojiRecord = yield Emoji_1.default.findOne({ messageId, emoji, userId, deleteAt: { $exists: false } });
                if (emojiRecord) {
                    emojiRecord.quantity += 1;
                    emojiRecord.updateAt = new Date();
                    yield emojiRecord.save();
                }
                else {
                    emojiRecord = new Emoji_1.default({
                        messageId,
                        emoji,
                        userId,
                        quantity: 1,
                        createAt: new Date(),
                        updateAt: new Date(),
                    });
                    yield emojiRecord.save();
                }
                const updatedMessage = yield Message_1.default.findById(messageId);
                if (!updatedMessage) {
                    return {
                        success: false,
                        message: "Message not found.",
                    };
                }
                const emojiDocs = yield Emoji_1.default.find({ _id: { $in: updatedMessage.emojis }, userId, deleteAt: { $exists: false } });
                const index = emojiDocs.findIndex(e => e.emoji === emoji);
                if (index !== -1) {
                    updatedMessage.emojis[updatedMessage.emojis.findIndex(eId => eId.equals(emojiDocs[index]._id))] = emojiRecord._id;
                }
                else {
                    updatedMessage.emojis.push(emojiRecord._id);
                }
                updatedMessage.updateAt = new Date();
                yield updatedMessage.save();
                const populatedMessage = yield Message_1.default.findById(messageId).populate('emojis');
                return {
                    success: true,
                    message: "Emoji added successfully.",
                    data: populatedMessage,
                };
            }
            catch (error) {
                console.error("Error in addEmoji:", error);
                return {
                    success: false,
                    message: error.message || "Failed to add emoji.",
                };
            }
        });
    }
    deleteMyEmoji(messageId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!messageId || !userId) {
                    return {
                        success: false,
                        message: "messageId and userId are required.",
                    };
                }
                const message = yield Message_1.default.findById(messageId);
                if (!message) {
                    return {
                        success: false,
                        message: "Message not found.",
                    };
                }
                const emojiDocs = yield Emoji_1.default.find({ _id: { $in: message.emojis }, userId, deleteAt: { $exists: false } });
                message.emojis = message.emojis.filter((emojiId) => !emojiDocs.some(e => e._id.toString() === emojiId));
                yield message.save();
                const result = yield Emoji_1.default.updateMany({ messageId, userId, deleteAt: { $exists: false } }, { $set: { deleteAt: new Date() } });
                if (result.modifiedCount === 0) {
                    return {
                        success: false,
                        message: "No emojis found for this user and message.",
                    };
                }
                return {
                    success: true,
                    message: `Successfully deleted ${result.modifiedCount} emojis.`,
                    data: message,
                };
            }
            catch (error) {
                console.error("Error in deleteMyEmoji:", error);
                return {
                    success: false,
                    message: error.message || "Failed to delete emojis.",
                };
            }
        });
    }
    getAllEmojiOfMessage(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!messageId) {
                    return {
                        success: false,
                        message: "messageId is required.",
                    };
                }
                const emojis = yield Emoji_1.default.find({ messageId, deleteAt: { $exists: false } });
                return {
                    success: true,
                    message: "Emojis retrieved successfully.",
                    data: emojis,
                };
            }
            catch (error) {
                console.error("Error in getAllEmojiOfMessage:", error);
                return {
                    success: false,
                    message: error.message || "Failed to retrieve emojis.",
                };
            }
        });
    }
};
exports.MongooseEmojiRepository = MongooseEmojiRepository;
exports.MongooseEmojiRepository = MongooseEmojiRepository = __decorate([
    (0, inversify_1.injectable)()
], MongooseEmojiRepository);
