// User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  phone: { type: String },
  gender: { type: String },
  dateOfBirth: { type: Date },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  status: { type: String },
  twoFactorAuthenticationSecret: { type: String },
  isTwoFactorAuthenticationEnabled: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
