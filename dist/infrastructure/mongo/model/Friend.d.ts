import mongoose, { Types } from "mongoose";
import { IFriendType } from "../../../domain/entities/friend/Friend.type";
export interface FriendDocument extends Omit<IFriendType, 'user' | '_id' | 'friend'>, Document {
    toObject(): unknown;
    _id: Types.ObjectId;
    user: Types.ObjectId;
    friend: Types.ObjectId;
}
declare const _default: mongoose.Model<FriendDocument, {}, {}, {}, mongoose.Document<unknown, {}, FriendDocument, {}> & FriendDocument & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, mongoose.Schema<FriendDocument, mongoose.Model<FriendDocument, any, any, any, mongoose.Document<unknown, any, FriendDocument, any> & FriendDocument & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, FriendDocument, mongoose.Document<unknown, {}, mongoose.FlatRecord<FriendDocument>, {}> & mongoose.FlatRecord<FriendDocument> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>>;
export default _default;
