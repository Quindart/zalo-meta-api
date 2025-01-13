const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  createAt: { type: Date, default: Date.now },
  deleteAt: { type: Date },
  filename: { type: String, required: true },
  id: { type: String, unique: true },
  path: { type: String, required: true },
  size: { type: String },
  updateAt: { type: Date, default: Date.now },
  thread: { type: mongoose.Schema.Types.ObjectId, ref: "Thread" },
});

module.exports = mongoose.model("File", FileSchema);
