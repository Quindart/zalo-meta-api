import mongoose from "mongoose";

const USER_STATUS = {
  ACTIVE: "ACTIVE",
  UNACTIVE: "UNACTIVE",
};

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  phone: { type: String, unique: true },
  gender: { type: String },
  dateOfBirth: { type: Date },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  status: { type: String, enum: [USER_STATUS.ACTIVE, USER_STATUS.UNACTIVE] },
  twoFactorAuthenticationSecret: { type: String },
  isTwoFactorAuthenticationEnabled: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  isVerifiedMail: {
    type: Boolean,
    default: false
  },
  isEmailNotificationEnabled: { type: Boolean, default: true },
  emailSentAt: { type: Date },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "Friend" }],
  channels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Channel" }]
},
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
