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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const channel_enum_1 = require("../../../types/enum/channel.enum");
const ChannelSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: ["personal", "group"],
        default: "personal",
    },
    createdAt: { type: Date, default: Date.now },
    deletedAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
    name: { type: String },
    updatedAt: { type: Date, default: Date.now },
    avatar: { type: String },
    description: { type: String },
    lastMessage: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Message" },
    deletedForUsers: [
        {
            user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
        },
    ],
    members: [
        {
            user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
            role: {
                type: mongoose_1.default.Schema.Types.String,
                enum: [channel_enum_1.ROLE_TYPES.CAPTAIN, channel_enum_1.ROLE_TYPES.SUB_CAPTAIN, channel_enum_1.ROLE_TYPES.MEMBER]
            },
        },
    ],
});
exports.default = mongoose_1.default.model("Channel", ChannelSchema);
