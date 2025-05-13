import { Document, model, Schema, Types } from "mongoose";
import { IUserType } from "../../../domain/entities/user/User.type";

const USER_STATUS = {
  ACTIVE: "ACTIVE",
  UNACTIVE: "UNACTIVE",
};
export interface UserDocument extends Omit<IUserType, '_id'>, Document {
  toObject(): unknown;
  _id: Types.ObjectId;
}
const UserSchema: Schema<UserDocument> = new Schema({
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
  channels: [{ type: Schema.Types.ObjectId, ref: "Channel" }]
},
  { timestamps: true }
);

export default model<UserDocument>("User", UserSchema);;