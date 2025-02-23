import mongoose from "mongoose";

const ChannelSchema = new mongoose.Schema({
  createAt: { type: Date, default: Date.now },
  deleteAt: { type: Date },
  name: { type: String, required: true },
  updateAt: { type: Date, default: Date.now },
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
