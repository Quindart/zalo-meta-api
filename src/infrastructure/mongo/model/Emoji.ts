import mongoose, { Schema, Types } from "mongoose";
import { IEmojiType } from "../../../domain/entities/emoji/Emoji.entity";
export interface EmojiDocument extends Omit<IEmojiType, 'messageId' | 'userId'>, Document {
  toObject(): unknown;
  messageId: Types.ObjectId;
  userId: Types.ObjectId
}

const EmojiSchema: Schema<EmojiDocument> = new Schema({
  createAt: { type: Date, default: Date.now },
  deleteAt: { type: Date },
  emoji: { type: String, required: true },
  quantity: { type: Number, default: 0 },
  updateAt: { type: Date, default: Date.now },
  // thread: { type: mongoose.Schema.Types.ObjectId, ref: "Thread" },
  messageId: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model("Emoji", EmojiSchema);
