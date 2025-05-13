import mongoose, { Types } from "mongoose";
import { IMessageType } from "../../../domain/entities/message/Message.type";
export interface MessageDocument extends Omit<IMessageType, '_id' | 'senderId' | 'channelId' | 'fileId' | 'systemMessageId' | 'isDeletedById' | 'imagesGroup' | 'emojis'>, Document {
    toObject(): unknown;
    _id: Types.ObjectId;
    senderId: Types.ObjectId;
    channelId: Types.ObjectId;
    fileId: Types.ObjectId;
    systemMessageId: Types.ObjectId;
    isDeletedById: Types.ObjectId[];
    emojis: Types.ObjectId[];
    imagesGroup: Types.ObjectId[];
}
declare const _default: mongoose.Model<MessageDocument, {}, {}, {}, mongoose.Document<unknown, {}, MessageDocument, {}> & MessageDocument & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, mongoose.Schema<MessageDocument, mongoose.Model<MessageDocument, any, any, any, mongoose.Document<unknown, any, MessageDocument, any> & MessageDocument & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, MessageDocument, mongoose.Document<unknown, {}, mongoose.FlatRecord<MessageDocument>, {}> & mongoose.FlatRecord<MessageDocument> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>>;
export default _default;
