import mongoose, { Document, Schema, Types } from "mongoose";
import { IChannelType } from "../../../domain/entities/channel/Channel.type";
import { ROLE_TYPES } from "../../../types/enum/channel.enum";

export interface ChannelDocument extends Omit<IChannelType, '_id' | 'deletedForUsers' | 'members' | 'lastMessage'>, Document {
  toObject(): unknown;
  _id: Types.ObjectId;
  deletedForUsers: {
    user: Types.ObjectId
  }[];
  lastMessage: Types.ObjectId;
  members: {
    user: Types.ObjectId;
    role: ROLE_TYPES
  }[]
}

const ChannelSchema: Schema<ChannelDocument> = new Schema({
  type: {
    type: String,
    enum: ["personal", "group"],
    default: "personal",
  },
  createdAt: { type: Date, default: Date.now },
  deletedAt: { type: Date },
  isDeleted: { type: Boolean, default: false },
  name: { type: String },
  updatedAt: { type: Date, default: Date.now },
  avatar: { type: String },
  description: { type: String },
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  deletedForUsers: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  ],
  members: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      role: {
        type: mongoose.Schema.Types.String,
        enum: [ROLE_TYPES.CAPTAIN, ROLE_TYPES.SUB_CAPTAIN, ROLE_TYPES.MEMBER]
      },
    },
  ],
});

export default mongoose.model<ChannelDocument>("Channel", ChannelSchema);
