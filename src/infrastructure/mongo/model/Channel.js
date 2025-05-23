import mongoose from "mongoose";

const ChannelSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["personal", "group"],
    default: "personal",
  },   
  createdAt: { type: Date, default: Date.now },
  deletedAt: { type: Date },
  name: { type: String },
  updatedAt: { type: Date, default: Date.now },
  avatar: { type: String },
  description: { type: String },
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
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
