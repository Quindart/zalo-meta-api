import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  content: String,
  status: String,
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
  },
  emojiId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Emoji",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
},
  { timestamps: true }

);

export default mongoose.model("Message", MessageSchema);
