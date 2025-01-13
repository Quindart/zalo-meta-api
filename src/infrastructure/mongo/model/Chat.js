const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  createAt: { type: Date, default: Date.now },
  deleteAt: { type: Date },
  isFriend: { type: Boolean, default: false },
  requestAdd: { type: Boolean, default: false },
  timeThread: { type: Date },
  userRequest: { type: String },
  thread: { type: mongoose.Schema.Types.ObjectId, ref: "Thread" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Chat", ChatSchema);
