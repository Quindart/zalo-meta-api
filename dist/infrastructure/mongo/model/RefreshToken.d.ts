import mongoose, { Types } from 'mongoose';
import { IRefreshTokenType } from '../../../domain/entities/refreshToken/RefreshToken.type';
export interface RefreshTokenDocument extends Omit<IRefreshTokenType, '_id'>, Document {
    toObject(): unknown;
    _id: Types.ObjectId;
}
declare const RefreshToken: mongoose.Model<RefreshTokenDocument, {}, {}, {}, mongoose.Document<unknown, {}, RefreshTokenDocument, {}> & RefreshTokenDocument & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, mongoose.Schema<RefreshTokenDocument, mongoose.Model<RefreshTokenDocument, any, any, any, mongoose.Document<unknown, any, RefreshTokenDocument, any> & RefreshTokenDocument & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, RefreshTokenDocument, mongoose.Document<unknown, {}, mongoose.FlatRecord<RefreshTokenDocument>, {}> & mongoose.FlatRecord<RefreshTokenDocument> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>>;
export default RefreshToken;
