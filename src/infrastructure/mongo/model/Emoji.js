const mongoose = require("mongoose");

const EmojiSchema = new mongoose.Schema({
  createAt: { type: Date, default: Date.now },
  deleteAt: { type: Date },
  emoji: { type: String, required: true },
  id: { type: String, unique: true },
  quantity: { type: Number, default: 0 },
  updateAt: { type: Date, default: Date.now },
  thread: { type: mongoose.Schema.Types.ObjectId, ref: "Thread" },
});

module.exports = mongoose.model("Emoji", EmojiSchema);
