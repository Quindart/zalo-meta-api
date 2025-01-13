const mongoose = require("mongoose");

const ThreadSchema = new mongoose.Schema({
  createAt: { type: Date, default: Date.now },
  deleteAt: { type: Date },
  id: { type: String, unique: true },
  isEdited: { type: Boolean, default: false },
  isRecall: { type: Boolean, default: false },
  isReply: { type: Boolean, default: false },
  updateAt: { type: Date, default: Date.now },
  channel: { type: mongoose.Schema.Types.ObjectId, ref: "Channel" },
});

module.exports = mongoose.model("Thread", ThreadSchema);
