import { ISystemMessageType } from './../../../domain/entities/systemMessage/SystemMessage.type';
import mongoose, { Document, Schema, Types } from "mongoose";
export interface SystemMessageDocument extends Omit<ISystemMessageType, 'messageId' | '_id'>, Document {

  toObject(): unknown;
  _id: Types.ObjectId;
  messageId: Types.ObjectId;

}
const SystemMessageSchema: Schema<SystemMessageDocument> = new Schema({
  actionType: {
    type: String,
    enum: [
      'member_added',
      'member_removed',
      'channel_created',
      'channel_renamed',
      'call_started',
      'call_ended',
      'pinned_message',
      'unpinned_message',
      'group_icon_updated',
      'announcement',
      'group_dissolved'
    ],
    required: true
  },
  messageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

export default mongoose.model("SystemMessage", SystemMessageSchema);