import mongoose from "mongoose";

const ChannelSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["personal", "group"],
    default: "personal",
  },   
  createAt: { type: Date, default: Date.now },
  deleteAt: { type: Date },
  name: { type: String },
  updateAt: { type: Date, default: Date.now },
  avatar: { type: String },
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
