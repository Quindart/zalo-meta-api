import mongoose, { Types } from "mongoose";
import { IEmojiType } from "../../../domain/entities/emoji/Emoji.entity";
export interface EmojiDocument extends Omit<IEmojiType, 'messageId' | 'userId'>, Document {
    toObject(): unknown;
    messageId: Types.ObjectId;
    userId: Types.ObjectId;
}
declare const _default: mongoose.Model<EmojiDocument, {}, {}, {}, mongoose.Document<unknown, {}, EmojiDocument, {}> & EmojiDocument & Required<{
    _id: string;
}> & {
    __v: number;
}, mongoose.Schema<EmojiDocument, mongoose.Model<EmojiDocument, any, any, any, mongoose.Document<unknown, any, EmojiDocument, any> & EmojiDocument & Required<{
    _id: string;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, EmojiDocument, mongoose.Document<unknown, {}, mongoose.FlatRecord<EmojiDocument>, {}> & mongoose.FlatRecord<EmojiDocument> & Required<{
    _id: string;
}> & {
    __v: number;
}>>;
export default _default;
