import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: String,
  status: String,
  messageType: {
    type: String,
    enum: ['text', 'image', 'video', 'file', 'audio', 'emoji', 'system', 'other'],
    default: 'text'
  },
  channelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channel",
  },
  emojiId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Emoji",
  },
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