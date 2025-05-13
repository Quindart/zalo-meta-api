import mongoose, { Document, Types } from "mongoose";
import { IChannelType } from "../../../domain/entities/channel/Channel.type";
import { ROLE_TYPES } from "../../../types/enum/channel.enum";
export interface ChannelDocument extends Omit<IChannelType, '_id' | 'deletedForUsers' | 'members' | 'lastMessage'>, Document {
    toObject(): unknown;
    _id: Types.ObjectId;
    deletedForUsers: {
        user: Types.ObjectId;
    }[];
    lastMessage: Types.ObjectId;
    members: {
        user: Types.ObjectId;
        role: ROLE_TYPES;
    }[];
}
declare const _default: mongoose.Model<ChannelDocument, {}, {}, {}, mongoose.Document<unknown, {}, ChannelDocument, {}> & ChannelDocument & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
