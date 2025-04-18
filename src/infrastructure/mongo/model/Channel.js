import mongoose from "mongoose";
import { is } from "useragent";

const ChannelSchema = new mongoose.Schema({
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
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  deletedForUsers: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  ],
  members: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      role: {
        type: mongoose.Schema.Types.String,
      },
    },
  ],
});

export default mongoose.model("Channel", ChannelSchema);
