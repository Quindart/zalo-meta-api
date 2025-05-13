"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
exports.MongooseMessageRepository = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const Message_1 = __importDefault(require("../model/Message"));
const Channel_1 = __importDefault(require("../model/Channel"));
const SystemMessage_1 = __importDefault(require("../model/SystemMessage"));
const MongooseBaseEntity_1 = require("./MongooseBaseEntity");
const inversify_1 = require("inversify");
let MongooseMessageRepository = class MongooseMessageRepository {
    constructor() {
        this._baseRepository = new MongooseBaseEntity_1.MongooseBaseRepository();
    }
    //TODO: DONE
    toSave(document) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._baseRepository.toSave(document);
        });
    }
    //TODO: DONE
    createSystemMessage(actionType) {
        return __awaiter(this, void 0, void 0, function* () {
            const systemMessage = new SystemMessage_1.default({
                actionType: actionType,
            });
            yield systemMessage.save();
            return systemMessage;
        });
    }
    //TODO: DONE
    createMessage(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const message = yield Message_1.default.create(params);
                return message;
            }
            catch (error) {
                console.error("Error in createMessage:", error);
                throw new Error(error.message || "Failed to create message.");
            }
        });
    }
    recallMessage(senderId, messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const message = yield Message_1.default.findById(messageId);
                if (!message) {
                    throw new Error("Message not found.");
                }
                // if (this._checkIsNotYourMessage(senderId, message.user.toString())) {
                //     throw new Error("You are not authorized to recall this message.");
                // }
                message.isDeletedById = message.isDeletedById || [];
                const senderObjId = new mongoose_1.Types.ObjectId(senderId);
                message.isDeletedById.push(senderObjId);
                yield message.save();
            }
            catch (error) {
                console.error("Error in recallMessage:", error);
                throw new Error(error.message || "Failed to recall message.");
            }
        });
    }
    deleteMessage(senderId, messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const message = yield Message_1.default.findById(messageId);
                if (!message) {
                    throw new Error("Message not found.");
                }
                message.content = "Tin nhắn đã thu hồi";
                message.messageType = "text";
                yield message.save();
            }
            catch (error) {
                console.error("Error in deleteMessage:", error);
                throw new Error(error.message || "Failed to delete message.");
            }
        });
    }
    getMessages(channelId, currentUserId, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            channelId = new mongoose_1.default.Types.ObjectId(channelId);
            const messages = yield Message_1.default.find({ channelId: channelId })
                .populate('senderId', 'firstName lastName avatar')
                .populate('emojis')
                .populate('fileId', 'filename path size extension')
                .populate('imagesGroup', 'filename path size extension')
                .sort({ createdAt: -1 })
                .skip(offset)
                .limit(10)
                .lean();
            const messagesFilter = messages.filter((message) => {
                if (message.isDeletedById && message.isDeletedById.length > 0) {
                    const isDeletedById = message.isDeletedById.find((deletedId) => deletedId.toString() === currentUserId.toString());
                    if (isDeletedById) {
                        return false; // Nếu tin nhắn bị xóa bởi người gửi, không hiển thị
                    }
                }
                return true; // Nếu không bị xóa, hiển thị tin nhắn
            });
            const messagesFormat = messagesFilter.map((message) => {
                let file = null;
                if (message.fileId) {
                    file = {
                        id: message.fileId._id,
                        filename: message.fileId.filename,
                        path: message.fileId.path,
                        size: message.fileId.size,
                        extension: message.fileId.extension,
                    };
                }
                return {
                    id: message._id,
                    sender: {
                        id: message.senderId._id,
                        name: message.senderId.lastName + " " + message.senderId.firstName,
                        avatar: message.senderId.avatar,
                    },
                    emojis: message.emojis ? message.emojis : [],
                    file: file,
                    imagesGroup: message.imagesGroup ? message.imagesGroup : [],
                    channelId: message.channelId,
                    status: "send",
                    timestamp: message.createdAt,
                    isMe: true,
                    messageType: message.messageType,
                    content: message.content,
                };
            });
            messagesFormat.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
            return messagesFormat;
        });
    }
    getMessagesByMessageId(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const message = yield Message_1.default.findById(new mongoose_1.default.Types.ObjectId(messageId))
                    .populate('user', 'firstName lastName avatar')
                    .populate('fileId', 'filename path size extension')
                    .lean();
                if (!message) {
                    return null;
                }
                let file = null;
                if (message.messageType === "file" && message.fileId) {
                    file = {
                        id: message.fileId._id,
                        filename: message.fileId.filename,
                        path: message.fileId.path,
                        size: message.fileId.size,
                        extension: message.fileId.extension,
                    };
                }
                const formattedMessage = {
                    id: message._id,
                    sender: {
                        id: message.user._id,
                        name: `${message.user.lastName} ${message.user.firstName}`,
                        avatar: message.user.avatar,
                    },
                    file,
                    channelId: message.channel,
                    status: "send",
                    timestamp: message.createdAt,
                    isMe: true, // Có thể cần kiểm tra currentUserId
                    messageType: message.messageType,
                    content: message.content,
                    isDeletedById: message.isDeletedById || [],
                };
                return formattedMessage;
            }
            catch (error) {
                console.error("Error in getMessagesByMessageId:", error);
                throw new Error(error.message || "Failed to retrieve message.");
            }
        });
    }
    deleteHistoryMessage(senderId, channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const senderObjId = new mongoose_1.Types.ObjectId(senderId);
                const messages = yield Message_1.default.find({ channel: new mongoose_1.Types.ObjectId(channelId) });
                for (const message of messages) {
                    message.isDeletedById = message.isDeletedById || [];
                    if (!message.isDeletedById.includes(senderObjId)) {
                        message.isDeletedById.push(senderObjId);
                        yield message.save();
                    }
                }
                const channel = yield Channel_1.default.findById(channelId);
                if (!channel) {
                    throw new Error("Channel not found.");
                }
                if (!channel.deletedForUsers.some((u) => u.user.toString() === senderObjId)) {
                    channel.deletedForUsers.push({ user: senderObjId });
                    yield channel.save();
                }
            }
            catch (error) {
                console.error("Error in deleteHistoryMessage:", error);
                throw new Error(error.message || "Failed to delete message history.");
            }
        });
    }
    _checkIsNotYourMessage(senderId, senderStoredId) {
        return senderStoredId !== senderId;
    }
};
exports.MongooseMessageRepository = MongooseMessageRepository;
exports.MongooseMessageRepository = MongooseMessageRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], MongooseMessageRepository);
