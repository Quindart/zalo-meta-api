import { ISystemMessageType } from './../../../domain/entities/systemMessage/SystemMessage.type';
import mongoose, { Document, Types } from "mongoose";
export interface SystemMessageDocument extends Omit<ISystemMessageType, 'messageId' | '_id'>, Document {
    toObject(): unknown;
    _id: Types.ObjectId;
    messageId: Types.ObjectId;
}
declare const _default: mongoose.Model<SystemMessageDocument, {}, {}, {}, mongoose.Document<unknown, {}, SystemMessageDocument, {}> & SystemMessageDocument & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, mongoose.Schema<SystemMessageDocument, mongoose.Model<SystemMessageDocument, any, any, any, mongoose.Document<unknown, any, SystemMessageDocument, any> & SystemMessageDocument & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, SystemMessageDocument, mongoose.Document<unknown, {}, mongoose.FlatRecord<SystemMessageDocument>, {}> & mongoose.FlatRecord<SystemMessageDocument> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>>;
export default _default;
