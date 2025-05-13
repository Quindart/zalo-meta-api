"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MessageSchema = new mongoose_1.default.Schema({
    senderId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    content: String,
    status: String,
    messageType: {
        type: String,
        enum: ['text', 'image', 'imageGroup', 'video', 'file', 'audio', 'emoji', 'system', 'other'],
        default: 'text'
    },
    channelId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Channel",
    },
    emojis: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Emoji",
        }
    ],
    imagesGroup: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "File",
        }
    ],
    fileId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "File",
    },
    systemMessageId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "SystemMessage"
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    isDeletedById: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
        },
    ]
}, { timestamps: true });
exports.default = mongoose_1.default.model("Message", MessageSchema);
