const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  createAt: { type: Date, default: Date.now },
  deleteAt: { type: Date },
  id: { type: String, unique: true },
  message: { type: String, required: true },
  type: { type: String },
  updateAt: { type: Date, default: Date.now },
  thread: { type: mongoose.Schema.Types.ObjectId, ref: "Thread" },
});

module.exports = mongoose.model("Message", MessageSchema);
