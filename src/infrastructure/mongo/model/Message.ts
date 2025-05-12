import mongoose, { Schema, Types } from "mongoose";
import { IMessageType } from "../../../domain/entities/message/Message.type";

export interface MessageDocument extends Omit<IMessageType, '_id' | 'senderId' | 'channelId' | 'fileId' | 'systemMessageId' | 'isDeletedById' | 'imagesGroup' | 'emojis'>, Document {
  toObject(): unknown;
  _id: Types.ObjectId;
  senderId: Types.ObjectId;
  channelId: Types.ObjectId;
  fileId: Types.ObjectId;
  systemMessageId: Types.ObjectId;
  isDeletedById: Types.ObjectId[];
  emojis: Types.ObjectId[]
  imagesGroup: Types.ObjectId[]
}

const MessageSchema: Schema<MessageDocument> = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: String,
  status: String,
  messageType: {
    type: String,
    enum: ['text', 'image', 'imageGroup', 'video', 'file', 'audio', 'emoji', 'system', 'other'],
    default: 'text'
  },
  channelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channel",
  },
  emojis: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Emoji",
    }
  ],
  imagesGroup: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
    }
  ],
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "File",
  },
  systemMessageId: {
    type: mongoose.Schema.Types.ObjectId,
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ]
},
  { timestamps: true }
);

export default mongoose.model("Message", MessageSchema);