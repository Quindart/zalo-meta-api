import mongoose, { Types } from "mongoose";
import { IFCMType } from "../../../domain/entities/fcm/FCM.type";
export interface FCMDocument extends Omit<IFCMType, '_id' | 'user'>, Document {
    toObject(): unknown;
    _id: Types.ObjectId;
    user: Types.ObjectId[];
}
declare const _default: mongoose.Model<FCMDocument, {}, {}, {}, mongoose.Document<unknown, {}, FCMDocument, {}> & FCMDocument & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, mongoose.Schema<FCMDocument, mongoose.Model<FCMDocument, any, any, any, mongoose.Document<unknown, any, FCMDocument, any> & FCMDocument & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, FCMDocument, mongoose.Document<unknown, {}, mongoose.FlatRecord<FCMDocument>, {}> & mongoose.FlatRecord<FCMDocument> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>>;
export default _default;
