import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  senderId: String,
  receiverId: String,
  content: String,
  status: String,
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
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
