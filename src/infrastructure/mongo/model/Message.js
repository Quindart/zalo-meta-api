import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  content: String,
  status: String,
  channelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channel",
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
