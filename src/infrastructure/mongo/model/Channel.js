const mongoose = require("mongoose");

const ChannelSchema = new mongoose.Schema({
  createAt: { type: Date, default: Date.now },
  deleteAt: { type: Date },
  id: { type: String, unique: true },
  name: { type: String, required: true },
  updateAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Channel", ChannelSchema);
