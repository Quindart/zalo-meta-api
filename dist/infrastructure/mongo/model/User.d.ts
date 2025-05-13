import { Document, Types } from "mongoose";
import { IUserType } from "../../../domain/entities/user/User.type";
export interface UserDocument extends Omit<IUserType, '_id'>, Document {
    toObject(): unknown;
    _id: Types.ObjectId;
}
declare const _default: import("mongoose").Model<UserDocument, {}, {}, {}, Document<unknown, {}, UserDocument, {}> & UserDocument & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
